// Grupo formado por Francisco Ramírez Cañadas y Jorge Repullo Serrano

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
        await page.goto('http://localhost:4200/');

        await page.locator('input[name="nombre"]').clear()
        await page.locator('input[name="DNI"]').clear()
        await page.locator('input[name="nombre"]').type('Manuel');
        await page.locator('input[name="DNI"]').type('123');

        // Nos vamos a la página principal
        const loginButton = page.locator('button[name="login"]');

        await Promise.all([page.waitForNavigation(), loginButton.click()]);
        sleep(2);

        await check(page, {
            'está en la página principal después de iniciar sesión': () => page.url().includes('/home'),
        });

        await check(page.locator('h2'), {
            encabezado: async (lo) => (await lo.textContent()) == 'Listado de pacientes',
        });

    } finally {
        await page.close();
    }
}