import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations', // para realizar iteraciones sin indicar el tiempo
      options: {
        browser: {
          type: 'chromium',
        }
      }
    }
  },
  thresholds: {
    checks: ["rate==1.0"]
  }
}

export default async function () {
    const page = await browser.newPage();
    try {
        // 1. LOGIN (as doctor)
        await page.goto('http://localhost:4200/');
        await page.locator('input[name="nombre"]').clear();
        await page.locator('input[name="DNI"]').clear();
        await page.locator('input[name="nombre"]').fill('Pepito');
        await page.locator('input[name="DNI"]').fill('12345678M');
        
        const loginButton = page.locator('button[name="login"]');
        // Use Promise.all for actions that trigger navigation
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), loginButton.click()]);

        // Verify URL after navigation
        check(page, {
            'is on home page after login': () => page.url().includes('/home'),
        });
        sleep(1); // Short sleep, similar to create-cuentas.js style after navigation

        // 2. DATOS DEL NUEVO PACIENTE
        // Ensure DNI is unique for each test run if necessary, or use a fixed one for testing
        const dni = `22228889R`; // Using a slightly different DNI
        const nombre = `Paca Nueva`;
        const edad = '42'; 
        const cita = 'Cita de prueba para Paca Nueva';

        // 3. NAVEGAR A LA PAGINA DE CREACIÓN
        // Assuming 'button[name="add"]' is the correct selector from home.component.html
        const addButton = page.locator('button[name="add"]');
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), addButton.click()]);
        
        // Verify being on the patient creation page
        check(page, {
            'is on patient create page': () => page.url().includes('/paciente/create'),
            // Optional: Check for a header on the create page, similar to create-cuentas.js
            // 'create page has correct header': async () => {
            //     const header = page.locator('h1'); // Adjust selector if needed
            //     return await header.isVisible() && (await header.textContent()).includes('Crear Paciente');
            // }
        });
        sleep(1); 

        // 4. RELLENAR DATOS DEL PACIENTE
        await page.locator('input[name="dni"]').fill(dni);
        await page.locator('input[name="nombre"]').fill(nombre);
        await page.locator('input[name="edad"]').fill(edad);
        await page.locator('input[name="cita"]').fill(cita);
        sleep(0.5); // Short pause after filling form

        // 5. ENVIAR EL FORMULARIO
        // Assuming 'button[type="submit"]' is the correct selector for the submit button on the create form
        const submitCreateButton = page.locator('form button[type="submit"]'); // Be more specific if possible e.g. inside a form
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), submitCreateButton.click()]);

        // Verify navigation back to home page
        check(page, {
            'is on home page after patient creation': () => page.url().includes('/home'),
        });
        sleep(2); // Allow time for table to potentially update, similar to create-cuentas.js

        // 6. VERIFICAR QUE EL PACIENTE SE HA CREADO
        const patientTableLocator = page.locator('table.mat-table');
        
        await check(patientTableLocator, {
            [`patient with DNI ${dni} is present in table`]: async (table) => {
                const dniCell = table.locator(`td[name="dni"]:has-text("${dni}")`);
                return await dniCell.isVisible();
            },
            [`patient with DNI ${dni} has correct name "${nombre}" in table`]: async (table) => {
                // Find the row that contains the specific DNI, then check the name in that row
                const patientRow = table.locator(`tr:has(td[name="dni"]:has-text("${dni}"))`);
                const nombreCell = patientRow.locator(`td[name="nombre"]`);
                if (await nombreCell.isVisible()) {
                    return (await nombreCell.textContent()) === nombre;
                }
                return false;
            }
        });

    } finally {
        await page.close();
};
};