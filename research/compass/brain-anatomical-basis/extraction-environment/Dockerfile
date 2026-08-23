FROM freesurfer/freesurfer:7.4.1@sha256:10b6468cbd9fcd2db3708f4651d59ad75d4da849a2c5d8bb6dba217f08b8c46b

USER root
RUN python3 -m pip install --no-cache-dir --disable-pip-version-check 'vtk==9.3.0'

LABEL org.diamondgate.contract="GEN1_EXTRACTION_ENVIRONMENT_V1" \
      org.diamondgate.freesurfer="7.4.1" \
      org.diamondgate.vtk="9.3.0"
