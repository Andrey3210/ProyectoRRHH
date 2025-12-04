package com.rrhh.incentivos.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("ATENCION")
public class ReglaAtencion extends ReglaIncentivo {

    @Override
    public BigDecimal calcularBono(Meta meta) {
        return this.getValorCalculo();
    }
}