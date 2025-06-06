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
      'está en la página principal después de iniciar sesión': () => page.url().includes('/home'),
    });
    await check(page.locator('h2'), {
      encabezado: async (lo) => (await lo.textContent()) == 'Listado de pacientes',
    });
    sleep(1);

    // 2. DATOS DEL NUEVO PACIENTE
    // creo el dni con todos los números de manera aleatoria
    const dni = Math.random().toString().slice(2, 10);
    const nombre = 'Paca Nueva';
    const edad = '42';
    const cita = 'Cita de prueba para Paca Nueva';

    // 3. NAVEGAR A LA PÁGINA DE CREACIÓN
    const addButton = page.locator('button[name="add"]');
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), addButton.click()]);

    // Verificar que estamos en la página de creación de paciente
    await check(page, {
      'está en la página de creación de paciente': () => page.url().includes('/paciente/create'),
    });
    sleep(1);

    // 4. RELLENAR DATOS DEL PACIENTE
    await page.locator('input[name="dni"]').type(dni);
    await page.locator('input[name="nombre"]').type(nombre);
    await page.locator('input[name="edad"]').type(edad);
    await page.locator('input[name="cita"]').type(cita);
    sleep(0.5);

    // 5. ENVIAR EL FORMULARIO
    const submitCreateButton = page.locator('form button[type="submit"]');
    await Promise.all([page.waitForNavigation(), submitCreateButton.click()]);

    await check(page, {
      'está en la página principal después de crear paciente': () => page.url().includes('/home'),
    });
    sleep(2);

    // 6. VERIFICAR QUE EL PACIENTE SE HA CREADO
    const filas = await page.$$('table tbody tr');
    const len = filas.length;
    const ultimaFila = filas[len - 1];

    const nombrePaciente = await ultimaFila.$('td[name="nombre"]');
    const pacienteText = await nombrePaciente.textContent();
    await check(pacienteText, {
      'el nombre del nuevo paciente es correcto': (text) => text.includes(nombre),
    });


  } finally {
    await page.close();
  };
};