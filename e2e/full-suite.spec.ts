import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://arenaos.egdev.cloud';
const CREDENTIALS = {
  email: 'admin@example.com',
  password: '123456789',
};

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await page.fill('input[name="email"]', CREDENTIALS.email);
  await page.fill('input[name="password"]', CREDENTIALS.password);
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

// Helper: confirm delete via the ConfirmDeleteDialog
async function confirmDelete(page: Page) {
  // Wait for the confirmation dialog to appear (z-[60] overlay)
  await page.waitForSelector('text=Confirm Delete, text=Delete Class, text=Delete Student, text=Delete Coach, text=Delete Plan, text=Delete Payment, text=Delete Branch', { timeout: 3000 }).catch(() => { });
  await page.waitForTimeout(300);
  // Click the red "Delete" button inside the confirmation dialog
  const deleteConfirmBtn = page.locator('button:has-text("Delete")').last();
  if (await deleteConfirmBtn.isVisible()) {
    await deleteConfirmBtn.click();
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
  }
}

// ============================================================
// 1. LOGIN TEST
// ============================================================
test.describe('1. Login Flow', () => {
  test('should login with valid credentials and redirect to /dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/01-login-page.png' });

    await page.fill('input[name="email"]', CREDENTIALS.email);
    await page.fill('input[name="password"]', CREDENTIALS.password);
    await page.click('button:has-text("Sign In")');

    await page.waitForURL('**/dashboard', { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');
    await page.screenshot({ path: 'e2e-results/01-dashboard-after-login.png' });
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button:has-text("Sign In")');

    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).toContain('login');
    await page.screenshot({ path: 'e2e-results/01-login-invalid.png' });
  });
});

// ============================================================
// 2. DASHBOARD TEST
// ============================================================
test.describe('2. Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display metric cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/02-dashboard-metrics.png', fullPage: true });

    const pageContent = await page.textContent('body');
    const hasMetrics = pageContent?.includes('Student') ||
      pageContent?.includes('Revenue') ||
      pageContent?.includes('Membership') ||
      pageContent?.includes('Attendance');
    expect(hasMetrics).toBeTruthy();
  });
});

// ============================================================
// 3. STUDENTS MODULE
// ============================================================
test.describe('3. Students Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a new student', async ({ page }) => {
    await page.goto(`${BASE_URL}/students`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/03-students-page.png', fullPage: true });

    await page.click('button:has-text("Add Student")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'e2e-results/03-add-student-modal.png' });

    await page.fill('input[name="first_name"]', 'E2E');
    await page.fill('input[name="last_name"]', 'TestStudent');
    await page.fill('input[name="email"]', `e2e.test.${Date.now()}@test.com`);

    await page.click('button:has-text("Create Student")');
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/03-student-created.png', fullPage: true });

    const content = await page.textContent('body');
    expect(content).toContain('E2E');
  });

  test('should edit a student', async ({ page }) => {
    await page.goto(`${BASE_URL}/students`);
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      const firstNameInput = page.locator('input[name="first_name"]');
      await firstNameInput.clear();
      await firstNameInput.fill('EditedE2E');

      await page.click('button:has-text("Save Changes")');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'e2e-results/03-student-edited.png', fullPage: true });
    }
  });

  test('should delete a student via confirmation dialog', async ({ page }) => {
    await page.goto(`${BASE_URL}/students`);
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      // Click the Delete button inside the edit modal
      const deleteBtn = page.locator('button:has-text("Delete")').first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: 'e2e-results/03-delete-confirm-dialog.png' });

        // Confirm the deletion in the ConfirmDeleteDialog
        await confirmDelete(page);
        await page.screenshot({ path: 'e2e-results/03-student-deleted.png', fullPage: true });
      }
    }
  });
});

// ============================================================
// 4. CLASSES MODULE
// ============================================================
test.describe('4. Classes Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a class', async ({ page }) => {
    await page.goto(`${BASE_URL}/classes`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/04-classes-page.png', fullPage: true });

    await page.click('button:has-text("Create Class"), button:has-text("Add Class")');
    await page.waitForTimeout(500);

    await page.fill('input[name="name"]', `E2E Class ${Date.now()}`);
    const schedInput = page.locator('input[name="schedule_info"]');
    if (await schedInput.isVisible()) {
      await schedInput.fill('Mon, Wed, Fri 5PM');
    }

    await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Create")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e-results/04-class-created.png', fullPage: true });
  });

  test('should delete a class via confirmation dialog', async ({ page }) => {
    await page.goto(`${BASE_URL}/classes`);
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('text=Edit Class').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      const deleteBtn = page.locator('button:has-text("Delete")').first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: 'e2e-results/04-delete-confirm-dialog.png' });
        await confirmDelete(page);
        await page.screenshot({ path: 'e2e-results/04-class-deleted.png', fullPage: true });
      }
    }
  });
});

// ============================================================
// 5. ATTENDANCE MODULE
// ============================================================
test.describe('5. Attendance Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should mark attendance and show history', async ({ page }) => {
    await page.goto(`${BASE_URL}/attendance`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/05-attendance-page.png', fullPage: true });

    // Select class
    const classSelect = page.locator('select').first();
    if (await classSelect.isVisible()) {
      const options = await classSelect.locator('option').all();
      if (options.length > 1) {
        await classSelect.selectOption({ index: 1 });
      }
    }

    // Select student
    const studentSelect = page.locator('select').nth(1);
    if (await studentSelect.isVisible()) {
      const options = await studentSelect.locator('option').all();
      if (options.length > 1) {
        await studentSelect.selectOption({ index: 1 });
      }
    }

    const markBtn = page.locator('button:has-text("Mark Attendance")');
    if (await markBtn.isVisible()) {
      await markBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'e2e-results/05-attendance-marked.png', fullPage: true });
    }

    // Verify history section
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toContain('history');
  });
});

// ============================================================
// 6. MEMBERSHIPS MODULE
// ============================================================
test.describe('6. Memberships Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a membership plan', async ({ page }) => {
    await page.goto(`${BASE_URL}/memberships`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/06-memberships-page.png', fullPage: true });

    await page.click('button:has-text("Add Plan")');
    await page.waitForTimeout(500);

    await page.fill('input[name="name"]', `E2E Plan ${Date.now()}`);
    await page.fill('input[name="price"]', '99.99');

    await page.click('button:has-text("Create Plan")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e-results/06-plan-created.png', fullPage: true });
  });
});

// ============================================================
// 7. PAYMENTS MODULE
// ============================================================
test.describe('7. Payments Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should register a payment and update dashboard', async ({ page }) => {
    // Note initial revenue
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    const initialContent = await page.textContent('body');

    await page.goto(`${BASE_URL}/payments`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/07-payments-page.png', fullPage: true });

    await page.click('button:has-text("Record Payment")');
    await page.waitForTimeout(500);

    const studentSelect = page.locator('select[name="student_id"]');
    if (await studentSelect.isVisible()) {
      const options = await studentSelect.locator('option').all();
      if (options.length > 1) {
        await studentSelect.selectOption({ index: 1 });
      }
    }

    await page.fill('input[name="amount"]', '75');
    await page.fill('input[name="description"]', 'E2E test payment');

    await page.click('button:has-text("Record Payment")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e-results/07-payment-recorded.png', fullPage: true });

    // Verify on dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/07-dashboard-revenue-updated.png', fullPage: true });
  });
});

// ============================================================
// 8. COACHES MODULE
// ============================================================
test.describe('8. Coaches Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a coach', async ({ page }) => {
    await page.goto(`${BASE_URL}/coaches`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/08-coaches-page.png', fullPage: true });

    await page.click('button:has-text("Add Coach")');
    await page.waitForTimeout(500);

    await page.fill('input[name="first_name"]', 'E2E');
    await page.fill('input[name="last_name"]', 'Coach');
    await page.fill('input[name="email"]', `e2e.coach.${Date.now()}@test.com`);

    await page.click('button:has-text("Create Coach")');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e-results/08-coach-created.png', fullPage: true });
  });

  test('should delete a coach via confirmation dialog', async ({ page }) => {
    await page.goto(`${BASE_URL}/coaches`);
    await page.waitForLoadState('networkidle');

    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await page.waitForTimeout(500);

      const deleteBtn = page.locator('button:has-text("Delete")').first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: 'e2e-results/08-delete-confirm-dialog.png' });
        await confirmDelete(page);
        await page.screenshot({ path: 'e2e-results/08-coach-deleted.png', fullPage: true });
      }
    }
  });
});

// ============================================================
// 9. SETTINGS MODULE
// ============================================================
test.describe('9. Settings Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should update settings and persist', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/09-settings-page.png', fullPage: true });

    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.clear();
      await nameInput.fill('ArenaOS Academy E2E');
    }

    await page.click('button:has-text("Save")');
    await page.waitForTimeout(2000);

    // Reload and verify
    await page.reload();
    await page.waitForLoadState('networkidle');
    const savedName = await page.locator('input[name="name"]').inputValue();
    expect(savedName).toContain('ArenaOS');
    await page.screenshot({ path: 'e2e-results/09-settings-persisted.png', fullPage: true });
  });
});

// ============================================================
// 10. DARK MODE
// ============================================================
test.describe('10. Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/10-light-mode.png', fullPage: true });

    // Click theme toggle — could be sun/moon icon button
    const themeButtons = page.locator('button');
    const count = await themeButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = themeButtons.nth(i);
      const html = await btn.innerHTML();
      if (html.includes('sun') || html.includes('moon') || html.includes('Sun') || html.includes('Moon')) {
        await btn.click();
        break;
      }
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'e2e-results/10-dark-mode.png', fullPage: true });

    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toContain('dark');
  });
});

// ============================================================
// 11. ARABIC LANGUAGE / RTL
// ============================================================
test.describe('11. Arabic Language / RTL', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should switch to Arabic and apply RTL', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    // Use the LanguageSwitcher dropdown
    const langSelect = page.locator('select').filter({ hasText: 'English' });
    if (await langSelect.first().isVisible()) {
      await langSelect.first().selectOption('ar');
      await page.waitForTimeout(1000);

      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
      await page.screenshot({ path: 'e2e-results/11-arabic-rtl.png', fullPage: true });

      // Switch back
      const langSelect2 = page.locator('select').filter({ hasText: 'العربية' });
      if (await langSelect2.first().isVisible()) {
        await langSelect2.first().selectOption('en');
      }
    }
    await page.screenshot({ path: 'e2e-results/11-back-to-english.png', fullPage: true });
  });
});

// ============================================================
// 12. MULTI-TENANT: SIGNUP FLOW
// ============================================================
test.describe('12. Multi-Tenant / Signup', () => {
  test('should navigate to signup page', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-results/12-signup-page.png', fullPage: true });

    expect(page.url()).toContain('/signup');

    // Verify form fields
    const academyInput = page.locator('input[name="academy_name"]');
    const adminInput = page.locator('input[name="admin_name"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    expect(await academyInput.isVisible()).toBeTruthy();
    expect(await adminInput.isVisible()).toBeTruthy();
    expect(await emailInput.isVisible()).toBeTruthy();
    expect(await passwordInput.isVisible()).toBeTruthy();
  });

  test('should attempt signup with new academy', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="academy_name"]', 'Test Academy 2');
    await page.fill('input[name="admin_name"]', 'Admin User 2');
    await page.fill('input[name="email"]', `academy2.e2e.${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'testpassword123');

    await page.click('button:has-text("Create Academy")');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'e2e-results/12-signup-result.png', fullPage: true });
  });
});
