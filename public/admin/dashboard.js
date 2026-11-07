const token = sessionStorage.getItem('ivethYolaAdminToken');

if (!token) {
    window.location.href = '/admin/index.html';
}

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

const guestList = document.getElementById('guestList');

async function apiRequest(url) {
    const response = await fetch(url, { headers });

    if (response.status === 401) {
        sessionStorage.clear();
        window.location.href = '/admin/index.html';
        throw new Error('Sessão expirada. Inicia sessão novamente.');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar os dados.');
    }

    return data;
}

async function loadDashboard() {
    try {
        const [overview, guests] = await Promise.all([
            apiRequest('/api/admin/overview'),
            apiRequest('/api/admin/guests')
        ]);

        document.getElementById('guestCount').textContent =
            overview.total_guests;

        document.getElementById('confirmedCount').textContent =
            overview.confirmed;

        document.getElementById('declinedCount').textContent =
            overview.declined;

        renderGuests(guests);

    } catch (error) {
        console.error(error);
        guestList.textContent = error.message;
    }
}

function renderGuests(guests) {
    guestList.replaceChildren();

    if (!guests.length) {
        guestList.textContent = 'Ainda não existem convidados.';
        return;
    }

    guests.forEach(guest => {
        const item = document.createElement('article');
        item.className = 'guest-item';

        const name = document.createElement('strong');
        name.textContent = guest.full_name;

        const phone = document.createElement('p');
        phone.textContent = guest.phone || 'Sem telefone registado';

        const status = document.createElement('span');
        status.textContent = guest.attending === true
            ? 'Presença confirmada'
            : guest.attending === false
                ? 'Presença recusada'
                : 'Sem resposta';

        const companions = document.createElement('p');
        companions.textContent =
            `Acompanhantes: ${guest.companions ?? 0}`;

        item.append(name, phone, status, companions);

        if (guest.message) {
            const message = document.createElement('p');
            message.textContent = `Mensagem: ${guest.message}`;
            item.appendChild(message);
        }

        guestList.appendChild(item);
    });
}

document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/admin/index.html';
});

loadDashboard();