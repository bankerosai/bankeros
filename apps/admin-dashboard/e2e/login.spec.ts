/**
 * Playwright E2E test — login + dashboard navigation.
 * Run with: pnpm exec playwright test
 */

import { test, expect } from '@playwright/test';

test.describe('BankerOS Admin Dashboard', () => {
  test('login flow', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login$/);

    // Login form is visible
    await expect(page.getByText('BankerOS')).toBeVisible();
    await expect(page.getByText('登录')).toBeVisible();

    // Pre-filled demo credentials
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue('admin@bankeros.io');

    // Submit
    await page.getByRole('button', { name: '登录' }).click();

    // Should reach the dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByText('运营仪表盘')).toBeVisible();
  });

  test('shows critical KPIs on dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: '登录' }).click();

    // KPI strip
    await expect(page.getByText('客户存款总额')).toBeVisible();
    await expect(page.getByText('贷款余额')).toBeVisible();
    await expect(page.getByText('活跃客户')).toBeVisible();

    // Payment table populated
    await expect(page.getByText('最新支付记录')).toBeVisible();
  });

  test('navigates between modules', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: '登录' }).click();

    // Navigate to Payments
    await page.getByRole('link', { name: '支付中心' }).click();
    await expect(page).toHaveURL('/payments');
    await expect(page.getByText('支付记录')).toBeVisible();

    // Navigate to GL
    await page.getByRole('link', { name: /总账/ }).click();
    await expect(page).toHaveURL('/gl');
    await expect(page.getByText('试算表')).toBeVisible();

    // GL must show balanced state
    await expect(page.getByText('✓ 借贷平衡')).toBeVisible();
  });

  test('FX trade calculator updates live', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: '登录' }).click();

    await page.getByRole('link', { name: 'FX 报价' }).click();
    await expect(page).toHaveURL('/fx');

    // Amount field
    const amountInput = page.locator('input[type="number"]');
    await amountInput.fill('5000000');

    // The displayed sell amount should reflect the rate
    await expect(page.getByText(/EUR/)).toBeVisible();
  });

  test('compliance page shows fraud cases', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: '登录' }).click();

    await page.getByRole('link', { name: '合规案件' }).click();
    await expect(page).toHaveURL('/compliance');

    // SAR case visible
    await expect(page.getByText('FRAUD-1716480000')).toBeVisible();
    // Block decision badge for high score
    await expect(page.getByText('BLOCK')).toBeVisible();
  });

  test('onboarding wizard advances through steps', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: '登录' }).click();

    await page.getByRole('link', { name: '数字开户' }).click();
    await expect(page).toHaveURL('/onboarding');

    // Step 1 — fill personal info
    await page.fill('input[placeholder="请输入真实姓名"]', 'Test User E2E');
    await page.fill('input[type="email"]', 'test.e2e@example.com');
    await page.fill('input[placeholder*="+86"]', '+86 13800000000');

    await page.getByRole('button', { name: '下一步 →' }).click();

    // Step 2 — address
    await expect(page.getByText('联系地址')).toBeVisible();
  });
});
