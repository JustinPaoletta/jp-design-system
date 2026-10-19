import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ControlsPage } from './controls.page';

describe('ControlsPage preview actions', () => {
  let fixture: ComponentFixture<ControlsPage>;
  let root: HTMLElement;
  let form: NgForm;

  const defaults = {
    email: 'coach@falcons.example',
    notes: '',
    role: 'editor',
    subscribe: true,
  };
  const savedLineup = {
    email: 'assistant@falcons.example',
    notes: 'Confirm the batting order before warmups.',
    role: 'admin',
    subscribe: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlsPage],
    }).compileComponents();
    fixture = TestBed.createComponent(ControlsPage);
    root = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    form = fixture.debugElement
      .query(By.directive(NgForm))
      .injector.get(NgForm);
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function enterLineup(value: typeof defaults): Promise<void> {
    const email = root.querySelector('jp-input input') as HTMLInputElement;
    const notes = root.querySelector('textarea') as HTMLTextAreaElement;
    const role = root.querySelector('select') as HTMLSelectElement;
    const subscribe = root.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    email.value = value.email;
    email.dispatchEvent(new Event('input', { bubbles: true }));
    email.dispatchEvent(new Event('blur'));
    notes.value = value.notes;
    notes.dispatchEvent(new Event('input', { bubbles: true }));
    role.value = value.role;
    role.dispatchEvent(new Event('change', { bubbles: true }));
    subscribe.checked = value.subscribe;
    subscribe.dispatchEvent(new Event('change', { bubbles: true }));
    await settle();
  }

  function button(label: string): HTMLButtonElement {
    const match = Array.from(root.querySelectorAll('jp-button button')).find(
      (element) => element.textContent?.trim() === label,
    );
    if (!match) throw new Error(`Missing ${label} button`);
    return match as HTMLButtonElement;
  }

  async function click(label: string): Promise<void> {
    button(label).click();
    await settle();
  }

  function expectLineup(value: typeof defaults): void {
    expect(
      (root.querySelector('jp-input input') as HTMLInputElement).value,
    ).toBe(value.email);
    expect((root.querySelector('textarea') as HTMLTextAreaElement).value).toBe(
      value.notes,
    );
    expect((root.querySelector('select') as HTMLSelectElement).value).toBe(
      value.role,
    );
    expect(
      (root.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked,
    ).toBe(value.subscribe);
    expect(form.value).toEqual(value);
  }

  it('saves projected fields without clearing values and cancels later edits', async () => {
    await enterLineup(savedLineup);
    expect(form.dirty).toBe(true);
    expect(form.touched).toBe(true);

    await click('Save');
    expectLineup(savedLineup);
    expect(form.pristine).toBe(true);
    expect(form.touched).toBe(true);
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Lineup saved in this preview.',
    );

    await enterLineup({
      email: 'unsaved@falcons.example',
      notes: 'Unsaved change.',
      role: 'viewer',
      subscribe: true,
    });
    await click('Cancel');
    expectLineup(savedLineup);
    expect(form.pristine).toBe(true);
    expect(form.untouched).toBe(true);
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Changes canceled.',
    );
  });

  it('resets the draft without replacing the saved lineup or density preference', async () => {
    await enterLineup(savedLineup);
    await click('Save');
    (root.querySelector('[role="switch"]') as HTMLButtonElement).click();
    await settle();

    await click('Reset');
    expectLineup(defaults);
    expect(root.querySelector('form')?.getAttribute('data-jp-density')).toBe(
      'compact',
    );
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Default lineup restored.',
    );

    await click('Cancel');
    expectLineup(savedLineup);
    expect(root.querySelector('form')?.getAttribute('data-jp-density')).toBe(
      'compact',
    );
  });

  it('removes the saved lineup, uses defaults when canceled, and allows a new save', async () => {
    await enterLineup(savedLineup);
    await click('Save');
    await click('Delete lineup');
    expectLineup(defaults);
    expect(button('Delete lineup').disabled).toBe(true);
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Saved lineup removed from this preview.',
    );

    await enterLineup(savedLineup);
    await click('Cancel');
    expectLineup(defaults);

    await enterLineup(savedLineup);
    await click('Save');
    expectLineup(savedLineup);
    expect(button('Delete lineup').disabled).toBe(false);
  });
});
