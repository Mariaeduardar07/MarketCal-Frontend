"use client";
import styles from "./PostStatusDistribution.module.css";

export default function PostStatusDistribution({ data = [] }) {
  // Dados de exemplo com valores realistas
  const defaultData = [
    { name: "Agendadas", value: 45, color: "#5dd4c0" },
    { name: "Publicadas", value: 202, color: "#47c4ac" },
    { name: "Rascunhos", value: 23, color: "#84e7d2" },
  ];

  const chartData = data && data.length > 0 && data.some(item => item.value > 0) 
    ? data.map((item, index) => ({
        ...item,
        color: ["#5dd4c0", "#47c4ac", "#84e7d2"][index] || "#5dd4c0"
      })) 
    : defaultData;

  const maxValue = Math.max(...chartData.map(item => item.value), 1);
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.container}>
      {/* Header com Total */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>Distribuição de Status</h3>
          <p className={styles.subtitle}>Total: {totalValue} postagens</p>
        </div>
      </div>

      {/* Gráfico de Barras Horizontais */}
      <div className={styles.barsContainer}>
        {chartData.map((item, index) => {
          const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0;

          return (
            <div 
              key={index} 
              className={styles.barRow}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Label + Valor à Esquerda */}
              <div className={styles.barInfo}>
                <span className={styles.barLabel}>{item.name}</span>
                <span 
                  className={styles.barCount}
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
              </div>

              {/* Track da Barra */}
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill}
                  style={{ 
                    width: `${barWidth}%`,
                    backgroundColor: item.color,
                  }}
                >
                  {/* Percentual dentro da barra se houver espaço */}
                  {barWidth > 15 && (
                    <span className={styles.barPercentage}>{percentage}%</span>
                  )}
                </div>
              </div>

              {/* Percentual à direita se não couber */}
              {barWidth <= 15 && (
                <span className={styles.percentageOutside} style={{ color: item.color }}>
                  {percentage}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legenda Inferior */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: "#5dd4c0" }} />
          <span className={styles.legendText}>Em espera</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: "#47c4ac" }} />
          <span className={styles.legendText}>Ativas</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ backgroundColor: "#84e7d2" }} />
          <span className={styles.legendText}>Em edição</span>
        </div>
      </div>
    </div>
  );
}