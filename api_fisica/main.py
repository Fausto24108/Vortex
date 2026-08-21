from math import cos, radians, sin
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="Vortex Physics API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LanzamientoRequest(BaseModel):
    gravedad: float = Field(gt=0, le=100)
    velocidadInicial: float = Field(gt=0, le=50)
    angulo: float = Field(ge=0, le=90)


class PuntoTrayectoria(BaseModel):
    x: float
    y: float
    tiempo: float


@app.get("/")
def raiz():
    return {
        "mensaje": "Vortex Physics API funcionando"
    }


@app.post("/simulador/lanzamiento")
def calcular_lanzamiento(
    datos: LanzamientoRequest
):
    gravedad = datos.gravedad
    velocidad = datos.velocidadInicial
    angulo = radians(datos.angulo)

    velocidad_x = velocidad * cos(angulo)
    velocidad_y = velocidad * sin(angulo)

    tiempo_total = (
        2 * velocidad_y / gravedad
    )

    altura_maxima = (
        velocidad_y ** 2
    ) / (
        2 * gravedad
    )

    distancia = (
        velocidad_x * tiempo_total
    )

    puntos: List[PuntoTrayectoria] = []

    paso = 0.04
    tiempo = 0.0

    while tiempo <= tiempo_total:
        x = velocidad_x * tiempo

        y = (
            velocidad_y * tiempo
            - 0.5 * gravedad * tiempo * tiempo
        )

        if y < 0:
            y = 0

        puntos.append(
            PuntoTrayectoria(
                x=x,
                y=y,
                tiempo=tiempo
            )
        )

        tiempo += paso

    puntos.append(
        PuntoTrayectoria(
            x=distancia,
            y=0,
            tiempo=tiempo_total
        )
    )

    return {
        "gravedad": gravedad,
        "velocidadInicial": velocidad,
        "angulo": datos.angulo,
        "duracion": tiempo_total,
        "distancia": distancia,
        "alturaMaxima": altura_maxima,
        "trayectoria": [
            punto.model_dump()
            for punto in puntos
        ]
    }