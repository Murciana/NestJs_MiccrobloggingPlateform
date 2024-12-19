import { test, expect } from '@playwright/test';

test.describe('RegisterPage', () => {

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/register');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Register/);
});

test('has head of a text', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/register');
  //Expect a <hX> "to contain" : Créer un nouveau compte
  await expect(page.getByRole('heading', { name: 'Créer un nouveau compte' })).toBeVisible();
});

test('has form', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/register');
  //Expect a form to be visible
  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Username:' })).toBeVisible();
  await expect(page.getByLabel('email')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password:' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Register/ })).toBeVisible();

});


});

