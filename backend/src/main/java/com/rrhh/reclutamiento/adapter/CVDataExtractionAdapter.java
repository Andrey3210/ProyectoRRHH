package com.rrhh.reclutamiento.adapter;

import com.rrhh.reclutamiento.adapter.model.CVParsedData;
import com.rrhh.shared.domain.model.CV;

public interface CVDataExtractionAdapter {
    CVParsedData extraerDatos(CV cv);
}
