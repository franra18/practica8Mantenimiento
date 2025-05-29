import { Medico } from "./medico";

export class Paciente {
    id: number | undefined;
    dni: any | undefined;
    nombre: any | undefined;
    edad: number | undefined;
    cita: any | undefined;
    medico: Medico | undefined;
    constructor() { }
}
