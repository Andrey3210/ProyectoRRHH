import React from 'react';

const MenuInicio = () => {
  const styles = {
    body: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px',
      animation: 'fadeIn 0.6s ease-in',
    },
    h1: {
      fontSize: '42px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '16px',
      lineHeight: 1.2,
    },
    headerP: {
      fontSize: '18px',
      color: '#6b7280',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '32px',
      marginBottom: '40px',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '32px 32px 24px 32px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '20px',
    },
    iconBox: {
      width: '64px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      flexShrink: 0,
    },
    iconBoxGreen: {
      background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
    },
    iconBoxDark: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
    },
    cardTitleH2: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '6px',
    },
    cardTitleP: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: 500,
    },
    cardContent: {
      padding: '32px',
    },
    cardText: {
      fontSize: '15px',
      color: '#374151',
      lineHeight: 1.7,
      marginBottom: '16px',
    },
    divider: {
      height: '1px',
      background: '#e5e7eb',
      margin: '24px 0',
    },
    sectionSubtitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    listItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      padding: '18px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      marginBottom: '16px',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    listIcon: {
      width: '40px',
      height: '40px',
      minWidth: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    listIconGreen: {
      background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
    },
    listIconBlue: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    listIconOrange: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    listIconPurple: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    listContentH3: {
      fontSize: '15px',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '4px',
    },
    listContentP: {
      fontSize: '13px',
      color: '#6b7280',
      lineHeight: 1.5,
      margin: 0,
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    btnBase: {
      padding: '14px 24px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 700,
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'all 0.3s',
      cursor: 'pointer',
      border: 'none',
      textAlign: 'center',
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #7ec856 0%, #16a34a 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(126, 200, 86, 0.3)',
    },
    btnOutline: {
      background: 'white',
      color: '#16a34a',
      border: '2px solid #7ec856',
    },
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [hoveredBtn, setHoveredBtn] = React.useState(null);

  const getCardStyle = (index) => ({
    ...styles.card,
    ...(hoveredCard === index && {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 28px rgba(126, 200, 86, 0.2)',
      borderColor: '#7ec856',
    }),
  });

  const getListItemStyle = (index) => ({
    ...styles.listItem,
    ...(hoveredItem === index && {
      borderColor: '#7ec856',
      transform: 'translateX(4px)',
      boxShadow: '0 4px 12px rgba(126, 200, 86, 0.1)',
    }),
  });

  const getBtnStyle = (type, index) => {
    const base = { ...styles.btnBase };
    if (type === 'primary') {
      return {
        ...base,
        ...styles.btnPrimary,
        ...(hoveredBtn === index && {
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(126, 200, 86, 0.4)',
        }),
      };
    }
    return {
      ...base,
      ...styles.btnOutline,
      ...(hoveredBtn === index && {
        background: '#16a34a',
        color: 'white',
        borderColor: '#16a34a',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(126, 200, 86, 0.3)',
      }),
    };
  };

  return (
    <div style={styles.body}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 1100px) {
            .grid { grid-template-columns: 1fr !important; }
          }
        `}
      </style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.h1}>Bienvenido(a) al Portal RRHH – ConectaTel</h1>
          <p style={styles.headerP}>
            Tu espacio como colaborador de nuestra empresa de telefonía. Aquí encontrarás información clave sobre la organización y recursos para tu día a día.
          </p>
        </div>

        {/* Grid */}
        <div style={styles.grid} className="grid">
          {/* Card 1: Quiénes Somos */}
          <div
            style={getCardStyle(0)}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, ...styles.iconBoxGreen }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" stroke="#7ec856" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h2 style={styles.cardTitleH2}>¿Quiénes somos?</h2>
                <p style={styles.cardTitleP}>Nuestra identidad como empresa de telefonía</p>
              </div>
            </div>

            <div style={styles.cardContent}>
              <p style={styles.cardText}>
                En <strong>ConectaTel</strong> nos dedicamos a brindar soluciones integrales de telefonía y conectividad, acercando a las personas y empresas a lo que más importa: estar siempre comunicados.
              </p>
              <p style={styles.cardText}>
                Nuestro propósito es ofrecer un servicio confiable, accesible y humano, apoyándonos en la innovación tecnológica y en el compromiso de nuestros colaboradores.
              </p>

              <div style={styles.divider}></div>

              <h3 style={styles.sectionSubtitle}>Nuestros pilares:</h3>

              {[
                { text: 'Calidad en el servicio al cliente' },
                { text: 'Trabajo en equipo y respeto' },
                { text: 'Innovación en telefonía y conectividad' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={getListItemStyle(`pilar-${idx}`)}
                  onMouseEnter={() => setHoveredItem(`pilar-${idx}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={{ ...styles.listIcon, ...styles.listIconGreen }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={styles.listContentH3}>{item.text}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Información del Colaborador */}
          <div
            style={getCardStyle(1)}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, ...styles.iconBoxDark }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h2 style={styles.cardTitleH2}>Información para el colaborador</h2>
                <p style={styles.cardTitleP}>Recursos y accesos rápidos</p>
              </div>
            </div>

            <div style={styles.cardContent}>
              <p style={styles.cardText}>
                Aquí encontrarás accesos a los módulos internos relacionados a tu experiencia como colaborador: procesos de selección, incentivos, vacaciones y más.
              </p>

              {[
                { title: 'Reclutamiento y selección', desc: 'Visualiza posiciones abiertas y seguimiento a procesos de selección.', color: 'Blue' },
                { title: 'Incentivos y reconocimientos', desc: 'Consulta tus bonos, metas y resultados del programa de incentivos.', color: 'Orange' },
                { title: 'Vacaciones y permisos', desc: 'Revisa y gestiona tus solicitudes de vacaciones y permisos.', color: 'Purple' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={getListItemStyle(`info-${idx}`)}
                  onMouseEnter={() => setHoveredItem(`info-${idx}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={{ ...styles.listIcon, ...styles[`listIcon${item.color}`] }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={styles.listContentH3}>{item.title}</h3>
                    <p style={styles.listContentP}>{item.desc}</p>
                  </div>
                </div>
              ))}

              <div style={styles.divider}></div>

              <h3 style={styles.sectionSubtitle}>Accesos rápidos:</h3>

              <div style={styles.buttonGroup}>
                <a
                  href="/posiciones"
                  style={getBtnStyle('primary', 0)}
                  onMouseEnter={() => setHoveredBtn(0)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  Ver posiciones abiertas
                </a>
                <a
                  href="/incentivos-reconocimientos"
                  style={getBtnStyle('outline', 1)}
                  onMouseEnter={() => setHoveredBtn(1)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  Incentivos y bonos
                </a>
                <a
                  href="/vacaciones-permisos"
                  style={getBtnStyle('outline', 2)}
                  onMouseEnter={() => setHoveredBtn(2)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  Vacaciones y permisos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuInicio;