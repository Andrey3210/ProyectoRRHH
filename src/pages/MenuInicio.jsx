import React from 'react'

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
      maxWidth: '820px',
      margin: '0 auto',
      lineHeight: 1.6,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '2px solid #e5e7eb',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      height: '100%',
    },
    cardHeader: {
      padding: '28px 28px 20px 28px',
      borderBottom: '1px solid #f3f4f6',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
    },
    iconBox: {
      width: '60px',
      height: '60px',
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
    iconBoxBlue: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    },
    cardTitleH2: {
      fontSize: '22px',
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
      padding: '28px',
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
      margin: '20px 0',
    },
    sectionSubtitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#1f2937',
      marginBottom: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    listItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '16px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      marginBottom: '12px',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    listIcon: {
      width: '38px',
      height: '38px',
      minWidth: '38px',
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
    listIconGray: {
      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
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
      gap: '12px',
      flexWrap: 'wrap',
    },
    btnBase: {
      padding: '12px 18px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 700,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
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
    tagRow: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '8px',
    },
    tag: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#065f46',
      background: 'rgba(22,163,74,0.1)',
      padding: '6px 10px',
      borderRadius: '9999px',
      border: '1px solid rgba(22,163,74,0.18)',
    },
  }

  const [hoveredCard, setHoveredCard] = React.useState(null)
  const [hoveredItem, setHoveredItem] = React.useState(null)
  const [hoveredBtn, setHoveredBtn] = React.useState(null)
  const modules = [
    {
      title: 'Reclutamiento y selección',
      desc: 'Visualiza posiciones abiertas, candidatos y etapas de pipeline.',
      color: 'Blue',
      href: '/posiciones',
    },
    {
      title: 'Recepción de CV',
      desc: 'Administra postulaciones recibidas y revisa CVs detallados.',
      color: 'Purple',
      href: '/recepcion-cv',
    },
    {
      title: 'Incentivos y reconocimientos',
      desc: 'Consulta dashboards, reglas y pagos del programa de bonos.',
      color: 'Orange',
      href: '/incentivos-reconocimientos',
    },
    {
      title: 'Vacaciones y permisos',
      desc: 'Solicita, aprueba y da seguimiento a ausencias programadas.',
      color: 'Green',
      href: '/vacaciones-permisos',
    },
    {
      title: 'Control de asistencia',
      desc: 'Reportes de puntualidad y línea de tiempo por colaborador.',
      color: 'Gray',
      href: '/control-asistencia',
    },
    {
      title: 'Gestión de empleados',
      desc: 'Directorio interno, datos de colaboradores y expedientes.',
      color: 'Blue',
      href: '/gestion-empleados',
    },
  ]

  const getCardStyle = (index) => ({
    ...styles.card,
    ...(hoveredCard === index && {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 28px rgba(126, 200, 86, 0.2)',
      borderColor: '#7ec856',
    }),
  })

  const getListItemStyle = (index) => ({
    ...styles.listItem,
    ...(hoveredItem === index && {
      borderColor: '#7ec856',
      transform: 'translateX(4px)',
      boxShadow: '0 4px 12px rgba(126, 200, 86, 0.1)',
    }),
  })

  const getBtnStyle = (type, index) => {
    const base = { ...styles.btnBase }
    if (type === 'primary') {
      return {
        ...base,
        ...styles.btnPrimary,
        ...(hoveredBtn === index && {
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(126, 200, 86, 0.4)',
        }),
      }
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
    }
  }

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
        <div style={styles.header}>
          <h1 style={styles.h1}>Bienvenido(a) al Portal RRHH – ConectaTel</h1>
          <p style={styles.headerP}>
            Organiza tu día a día con accesos rápidos a los módulos clave y conoce cómo nuestra empresa de telefonía sigue conectando a más de 2.5 millones de clientes en todo el país.
          </p>
        </div>

        <div style={styles.grid} className="grid">
          <div
            style={getCardStyle(0)}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, ...styles.iconBoxGreen }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
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
                En <strong>ConectaTel</strong> desplegamos redes móviles y de fibra óptica que acercan a las personas con lo que más importa: su familia, sus clientes y sus ideas.
              </p>
              <p style={styles.cardText}>
                Somos más de 1,200 colaboradores comprometidos con brindar señal estable, cobertura nacional y atención cercana para hogares y empresas.
              </p>

              <div style={styles.tagRow}>
                <span style={styles.tag}>Cobertura 98% zonas urbanas</span>
                <span style={styles.tag}>4 centros de atención</span>
                <span style={styles.tag}>Red 5G en expansión</span>
              </div>

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

          <div
            style={getCardStyle(1)}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, ...styles.iconBoxDark }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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
                Gestiona tus procesos internos con accesos directos a los módulos de RRHH. Desde postulaciones hasta pagos de incentivos, todo en un solo lugar.
              </p>

              {modules.map((item, idx) => (
                <a
                  key={item.title}
                  href={item.href}
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
                </a>
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
                  <span>Posiciones abiertas</span>
                </a>
                <a
                  href="/incentivos-reconocimientos"
                  style={getBtnStyle('outline', 1)}
                  onMouseEnter={() => setHoveredBtn(1)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <span>Incentivos y bonos</span>
                </a>
                <a
                  href="/vacaciones-permisos"
                  style={getBtnStyle('outline', 2)}
                  onMouseEnter={() => setHoveredBtn(2)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <span>Vacaciones y permisos</span>
                </a>
                <a
                  href="/control-asistencia"
                  style={getBtnStyle('outline', 3)}
                  onMouseEnter={() => setHoveredBtn(3)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  <span>Control de asistencia</span>
                </a>
              </div>
            </div>
          </div>

          <div
            style={getCardStyle(2)}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconBox, ...styles.iconBoxBlue }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M22 16.92V21a1 1 0 0 1-1.1 1 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3 2.1 1 1 0 0 1 4 1h4.09a1 1 0 0 1 1 .75 12.44 12.44 0 0 0 .7 2.22 1 1 0 0 1-.23 1L8.21 6.79a16 16 0 0 0 6 6l1.82-1.32a1 1 0 0 1 1-.12 12.44 12.44 0 0 0 2.22.7 1 1 0 0 1 .75 1v3.87z" />
                </svg>
              </div>
              <div>
                <h2 style={styles.cardTitleH2}>Operación de telefonía</h2>
                <p style={styles.cardTitleP}>Datos rápidos del negocio</p>
              </div>
            </div>

            <div style={styles.cardContent}>
              <p style={styles.cardText}>
                Mantenemos una red híbrida móvil y de fibra con nodos en 18 ciudades. Nuestro equipo técnico monitorea 24/7 la disponibilidad para garantizar comunicación continua a clientes residenciales y corporativos.
              </p>

              {[
                { text: 'Tiempo de disponibilidad promedio 99.4%', color: 'Blue' },
                { text: 'Centros de monitoreo en Lima, Trujillo y Arequipa', color: 'Purple' },
                { text: 'Programas de portabilidad y planes familiares adaptables', color: 'Orange' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={getListItemStyle(`tel-${idx}`)}
                  onMouseEnter={() => setHoveredItem(`tel-${idx}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={{ ...styles.listIcon, ...styles[`listIcon${item.color}`] }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={styles.listContentH3}>{item.text}</h3>
                  </div>
                </div>
              ))}

              <div style={styles.divider}></div>

              <h3 style={styles.sectionSubtitle}>Soporte interno:</h3>
              <div style={styles.buttonGroup}>
                <a
                  href="mailto:soporte.redes@conectatel.com"
                  style={getBtnStyle('outline', 4)}
                  onMouseEnter={() => setHoveredBtn(4)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  soporte.redes@conectatel.com
                </a>
                <a
                  href="tel:+51180012345"
                  style={getBtnStyle('primary', 5)}
                  onMouseEnter={() => setHoveredBtn(5)}
                  onMouseLeave={() => setHoveredBtn(null)}
                >
                  0-800-CONNECT
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuInicio
