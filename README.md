# datamirror
*(Working title — subject to change)*

Data Mirror is an interactive educational web project that helps users understand how online data collection works through experience rather than explanation. Users browse a simulated website while their interactions (such as scrolling, hovering, and time spent) are tracked. Afterward, the system visualizes what data was collected and what can be inferred from that behavior, allowing users to reflect on how platforms learn from them.

The experience is designed to highlight the gap between general awareness of data collection and practical understanding of how everyday interactions contribute to tracking, profiling, and personalization.

## Firebase Hosting Deployment Guide

This project is deployed using Firebase Hosting. Follow the steps below to run the website locally and deploy updates.

---

### 1. Clone the Repository:
```bash
git clone https://github.com/chuntr/datamirror.git
cd datamirror
cd frontend
```
The Firebase Hosting public directory is set to frontend. 

### 2. Start a local development server:
```bash
python3 -m http.server 8000
```
Open the site in your browser: http://localhost:8000
Stop the server if needed with CTRL + C

### 3. Install Firebase CLI:
```bash
npm install -g firebase-tools
```
### 4. Deploy the Website:

```bash
cd ..
firebase deploy
```
---

## Project Goals

- Make invisible data collection practices visible and understandable
- Help users connect everyday online behavior to data inference
- Explore how awareness can change behavior through feedback and reflection
- Provide an interactive alternative to static privacy education

---

## What’s in This Repository

- `README.md` – Project overview and documentation  
- `LICENSE` – Licensing information  

(Exact structure will evolve as the project develops.)

Hello - Alex


