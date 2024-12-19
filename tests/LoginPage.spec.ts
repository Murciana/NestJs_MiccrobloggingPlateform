import { test, expect } from '@playwright/test';

test.describe('LoginPage', () => {

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Login/);
});

test('has head of a text', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login');
  //Expect a <hX> "to contain" : Créer un nouveau compte
  await expect(page.getByRole('heading', { name: 'Se connecter à un compte' })).toBeVisible();
});


test('has form', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/login');
  //Expect a form to be visible
  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByLabel('email')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password:' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Login/ })).toBeVisible();

});


});