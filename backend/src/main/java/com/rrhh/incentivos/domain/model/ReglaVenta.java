package com.rrhh.incentivos.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("VENTA")
public class ReglaVenta extends ReglaIncentivo {

    @Override
    public BigDecimal calcularBono(Meta meta) {
        if ("PORCENTAJE".equals(this.getTipoValor())) {
            return meta.getValorActual().multiply(this.getValorCalculo().divide(BigDecimal.valueOf(100)));
        }
        return this.getValorCalculo();
    }
}