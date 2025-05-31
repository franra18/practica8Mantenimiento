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
            'está en la página principal después de iniciar sesión': () => page.url().includes('/home'),
        });
        await check(page.locator('h2'), {
            encabezado: async (lo) => (await lo.textContent()) == 'Listado de pacientes',
        });
        sleep(1);

        // 2. NAVEGAR A LA PÁGINA DEL ÚLTIMO PACIENTE DE LA LISTA
        const filas = await page.$$('table tbody tr');
        const len = filas.length;
        const ultimaFila = filas[len - 1];
        await Promise.all([page.waitForNavigation(), ultimaFila.click()]);
        await check(page, {
            'está en la vista del paciente': () => page.url().includes('/paciente/'),
        });
        sleep(1);

        // 3. HACER CLICK EN EL BOTÓN DE MOSTRAR IMAGEN
        const showImageButton = page.locator('button[name="view"]');
        await Promise.all([page.waitForNavigation(), showImageButton.click()]);
        await check(page, {
            'está en la vista de la imagen': () => page.url().includes('/image-detail/'),
        });
        sleep(1);

        // 4. HACER CLICK EN EL BOTÓN DE PREDECIR
        const predictButton = page.locator('button[name="predict"]');
        await Promise.all([page.waitForTimeout(500), predictButton.click()]);
        sleep(1);
        const predictSpan = page.locator('span[name="predict"]'); // Verificamos que el span de predicción existe y contiene el texto esperado
        await check(predictSpan, {
            'el span de predicción existe': async (span) => await span.isVisible()
        });
        await check(predictSpan, {
            'el span de predicción contiene texto': async (span) => {
                const text = await span.textContent();
                return text.includes('Probabilidad de cáncer:');
            }
        });


    } finally {
        await page.close();
    }
}