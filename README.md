# WorkerSalary Frontend

## Projektbeskrivning

Denna frontend-applikation är byggd för att kommunicera med WorkerSalary backend-systemet. Applikationen låter användare hantera tidrapportering, löner och uppdatering av personlig information. Systemet stödjer både vanliga användare och administratörer för att visa och uppdatera data från backend-API:t.

## Funktioner

- **Check-In/Check-Out**: Användare kan checka in och checka ut för att logga arbetade timmar.
- **Visa löneinformation**: Användare kan visa sin nuvarande och tidigare lön.
- **Uppdatera information**: Användare kan uppdatera sin personliga information som förnamn, efternamn, e-post, telefonnummer, adress och stad.
- **Administratörshantering**: Administratörer kan uppdatera information om anställda och hantera andra administrativa funktioner.

## Teknisk Stack

- **Frontend**: React
- **CSS Framework**: Bootstrap
- **API-förfrågningar**: Axios för kommunikation med backend
- **Routing**: React Router för att navigera mellan olika sidor

## Installation

### Förutsättningar

- Node.js (version 14+)
- Backend-projektet [WorkerSalary Backend](https://github.com/Jafar-Hussein/workerSalary) körs på `http://localhost:5000`

### Steg för att köra applikationen

1. Klona detta repository:

   ```bash
   git clone https://github.com/ditt-anvandar-namn/WorkerSalary-Frontend.git
   ```
2. Installera nödvändiga beroenden:

   ```
   npm install
   ```
3.
 ```
    npm start
 ```

### Logga in som administratör

För att kunna skapa inloggningar för medarbetare måste du först logga in som administratör:

- **Användarnamn**: `admin`
- **Lösenord**: `admin`

### Skapa medarbetare-inloggning

Efter att du har loggat in som administratör, följ dessa steg för att skapa en inloggning för en medarbetare:

1. Gå till "Lägg till medarbetare"-sidan.
2. Ange användarnamn och lösenord för den nya medarbetaren.
3. Fyll i den nödvändiga informationen som förnamn, efternamn, e-postadress och andra detaljer.
4. Klicka på "Skapa" för att registrera medarbetaren.

När medarbetaren är registrerad kan de logga in med sina uppgifter och börja använda systemet för att checka in, checka ut och visa sin löneinformation.
