import React, { useMemo, useState } from "react";

const css = `*{box-sizing:border-box}body{margin:0;background:#f7f8f5;font-family:Inter,Arial,sans-serif;color:#111827}.wrap{width:min(1320px,calc(100% - 40px));margin:auto}.head{background:rgba(251,252,248,.82);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,24,39,.1);padding:28px 20px;position:sticky;top:0;z-index:10}.row{display:flex;justify-content:space-between;gap:20px;align-items:center}h1{margin:0 0 8px;font-size:32px;letter-spacing:-.055em}.content{padding:30px 0}.filters{display:grid;grid-template-columns:190px 220px 1fr;gap:12px;margin-bottom:18px}.input,.select{width:100%;border:1px solid rgba(17,24,39,.1);border-radius:16px;padding:13px 14px;background:white}.layout{display:grid;grid-template-columns:1.1fr .9fr;gap:20px}.panel{background:white;border:1px solid rgba(17,24,39,.1);border-radius:28px;overflow:hidden}.panel-title{padding:18px 20px;border-bottom:1px solid rgba(17,24,39,.1);background:#fbfcf8}.grid{display:grid;grid-template-columns:90px 1fr}.time{background:#f3f5ef;font-weight:900;padding:16px 13px;border-bottom:1px solid rgba(17,24,39,.1);text-align:center;font-size:14px}.slot{min-height:80px;padding:10px;border-bottom:1px solid rgba(17,24,39,.1);background:white;display:flex;align-items:center}.session{width:100%;border-radius:16px;padding:12px;background:#ecffd1;border:1px solid #b7f34a}.visit{border:1px solid rgba(17,24,39,.1);border-radius:20px;padding:15px;margin-bottom:12px;background:white}.health-alert{background:#fef2f2;border:1px solid #fee2e2;padding:10px;border-radius:12px;color:#991b1b;font-size:13px;margin-top:8px;font-weight:bold}.badge{border-radius:999px;padding:4px 10px;font-size:12px;font-weight:900;background:#dbeafe;color:#1d4ed8}
@media(max-width:1100px){.layout{grid-template-columns:1fr}.filters{grid-template-columns:190px 1fr}.wrap{width:min(100%,calc(100% - 28px))}.panel{border-radius:24px}.row{align-items:flex-start}}
@media(max-width:760px){.head{padding:20px 14px;position:relative}.wrap{width:calc(100% - 20px)}.row{flex-direction:column;gap:8px;align-items:flex-start}h1{font-size:26px;line-height:1.05}.content{padding:18px 0}.filters{grid-template-columns:1fr;gap:10px}.input,.select{font-size:16px;padding:14px 14px;border-radius:15px}.layout{grid-template-columns:1fr;gap:16px}.panel{border-radius:20px}.panel-title{padding:16px}.panel-title h3{margin:0;font-size:18px}.panel:first-child{overflow-x:auto}.grid{min-width:620px}.time{padding:14px 10px}.slot{min-height:74px}.session{padding:12px;border-radius:14px}.visit{border-radius:18px;padding:14px}.health-alert{font-size:12px;line-height:1.45}.badge{font-size:11px}}
@media(max-width:420px){.wrap{width:calc(100% - 14px)}h1{font-size:24px}.head{padding:18px 10px}.content{padding:14px 0}.grid{min-width:560px}.time{font-size:13px}.slot{padding:8px}.visit{padding:12px}}
`;

export default function TrainerAdmin() {
  const [sessions, setSessions] = useState([
    { id: 1, client: 'Mantas Kazlauskas', phone: '+370 600 11223', service: 'Individuali treniruotė (60 min.)', date: '2026-06-08', time: '17:00', activity: 'Zemas', health: 'Išvarža juosmens srityje, negalima daryti jokių mirties traukų.', goal: 'Sustiprinti nugarą.', status: 'Patvirtinta' }
  ]);
  
  const [date, setDate] = useState('2026-06-08');
  const [search, setSearch] = useState('');

  // 60 MINUČIŲ TINKLELIS ADMIN PANELĖJE
  const times = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
  ];

  return (
    <main>
      <style>{css}</style>
      <header className="head">
        <div className="wrap row">
          <div>
            <h1>Trenerio Valdymo Skydas</h1>
            <p style={{margin:0, color:'#667085'}}>Suvienodintas 60 minučių grafiko tinklelis</p>
          </div>
        </div>
      </header>

      <section className="wrap content">
        <div className="filters">
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input className="input" placeholder="Ieškoti kliento..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="layout">
          {/* DIENOS TVARKARAŠTIS */}
          <div className="panel">
            <div className="panel-title"><h3>Dienos valandinis grafikas</h3></div>
            <div className="grid">
              {times.map(t => {
                const s = sessions.find(x => x.date === date && x.time === t);

                return (
                  <React.Fragment key={t}>
                    <div className="time">{t}</div>
                    <div className="slot">
                      {s ? (
                        <div className="session">
                          <strong>{s.client}</strong> – {s.service}
                          <div style={{fontSize: 12, color: '#475467'}}>Tel: {s.phone}</div>
                        </div>
                      ) : (
                        <span style={{color: '#98a2b3', fontSize: 13}}>Laisva valanda</span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* SVEIKATOS ANKETOS */}
          <div>
            <div className="panel-title" style={{background:'transparent', padding:'10px 0'}}><h3>Saugumo anketos</h3></div>
            {sessions.map(s => (
              <div className="visit" key={s.id}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <strong>{s.client}</strong>
                  <span className="badge">{s.status}</span>
                </div>
                <div style={{fontSize:13, color:'#667085', margin:'4px 0'}}>{s.service} (Laikas: {s.time})</div>
                
                <div style={{fontSize:13, margin:'8px 0'}}>
                  🏃‍♂️ <b>Aktyvumas:</b> {s.activity === 'Zemas' ? 'Žemas (Sėdimas)' : s.activity}
                </div>

                <div className="health-alert">
                  ⚠️ TRAUMOS / APRIBOJIMAI: {s.health}
                </div>

                <div style={{fontSize:13, marginTop:8, color:'#344054'}}>
                  🎯 <b>Tikslas:</b> {s.goal}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}