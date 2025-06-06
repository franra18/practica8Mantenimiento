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
        // 1. INICIAR SESIÓN
        await page.goto('http://localhost:4200/');
        await page.locator('input[name="nombre"]').clear()
        await page.locator('input[name="DNI"]').clear()
        await page.locator('input[name="nombre"]').type('Manuel');
        await page.locator('input[name="DNI"]').type('123');
        sleep(1);
        const loginButton = page.locator('button[name="login"]');
        await Promise.all([page.waitForNavigation(), loginButton.click()]);
        await check(page, {
            'está en la página principal después del login': () => page.url().includes('/home'),
        });
        await check(page.locator('h2'), {
            'Titulo Listado inicio': async (lo) => (await lo.textContent()) == 'Listado de pacientes',
        });
        sleep(1);

        // 2. NAVEGA A LA PÁGINA DEL ÚLTIMO PACIENTE DE LA LISTA
        const filas = await page.$$('table tbody tr');
        sleep(0.5);
        const len = filas.length;
        const ultimaFila = filas[len - 1];
        await Promise.all([page.waitForNavigation(), ultimaFila.click()]);
        await check(page, {
            'está en la vista de paciente': () => page.url().includes('/paciente/'),
        });
        sleep(1);

        // 3. CLICK EN EL BOTÓN DE MOSTRAR IMAGEN
        const showImageButton = page.locator('button[name="view"]');
        await Promise.all([page.waitForNavigation(), showImageButton.click()]);
        await check(page, {
            'está en la vista de imagen': () => page.url().includes('/image-detail/'),
        });
        sleep(1);

        // 4. CLICK EN EL BOTÓN DE NUEVO INFORME
        const addReportButton = page.locator('button[name="add"]');
        await Promise.all([page.waitForNavigation(), addReportButton.click()]);
        await check(page, {
            'está en la página de crear informe': () => page.url().includes('/informe/create'),
        });
        sleep(1);

        // 5. RELLENAR DATOS DEL INFORME Y GUARDAR
        await page.locator('textarea[id="mat-input-2"]').clear()
        await page.locator('textarea[id="mat-input-2"]').type('Para este informe se ha realizado una prueba de imagen y se ha determinado que el paciente está en buen estado.');

        const saveButton = page.locator('button[name="save"]');
        await Promise.all([page.waitForNavigation(), saveButton.click()]);
        await check(page, {
            'está en la vista de imagen otra vez': () => page.url().includes('/image-detail/'),
        });
        sleep(1);
        const contentSpan = page.locator('span[name="content"]');
        await check(contentSpan, {
            'Informe Creado': async (span) => {
                const text = await span.textContent();
                return text.includes('Para este informe se ha realizado una prueba de imagen y se ha determinado que el paciente está en buen estado.');
            }
        });
        sleep(1);
        
    } finally {
        await page.close();
    }
}