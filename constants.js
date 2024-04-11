const daysOfWeek = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'MIÉRCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'SÁBADO'
];

const openingHours = {
    LUNES: [
        {
            from: '9:00',
            to: '12:00'
        },
        {
            from: '14:00',
            to: '19:00'
        }
    ],
    MARTES: [
        {
            from: '9:00',
            to: '12:00'
        },
        {
            from: '14:00',
            to: '19:00'
        }
    ],
    MIERCOLES: [
        {
            from: '9:00',
            to: '12:00'
        },
        {
            from: '14:00',
            to: '19:00'
        }
    ],
    JUEVES: [
        {
            from: '9:00',
            to: '12:00'
        },
        {
            from: '14:00',
            to: '19:00'
        }
    ],
    VIERNES: [
        {
            from: '9:00',
            to: '12:00'
        },
        {
            from: '14:00',
            to: '19:00'
        }
    ],
    SABADO: [
        {
            from: '9:00',
            to: '12:00'
        },
        {
            from: '14:00',
            to: '17:00'
        }
    ]
};
module.exports = {
    daysOfWeek,
    openingHours
};
