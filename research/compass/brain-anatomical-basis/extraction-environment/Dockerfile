FROM python:3.11.9-slim-bookworm@sha256:2856e6af199e8128161abd320575eb9b341f3b76f017b5d0c9cd364f60d8a050 AS vtk_runtime
RUN python -m pip install --no-cache-dir --disable-pip-version-check --target=/opt/diamondgate-vtk 'vtk==9.3.0'

FROM freesurfer/freesurfer:7.4.1@sha256:10b6468cbd9fcd2db3708f4651d59ad75d4da849a2c5d8bb6dba217f08b8c46b
USER root
COPY --from=vtk_runtime /usr/local /opt/diamondgate-python
COPY --from=vtk_runtime /opt/diamondgate-vtk /opt/diamondgate-vtk
ENV PATH="/opt/diamondgate-python/bin:${PATH}" \
    PYTHONPATH="/opt/diamondgate-vtk"

LABEL org.diamondgate.contract="GEN1_EXTRACTION_ENVIRONMENT_V2" \
      org.diamondgate.freesurfer="7.4.1" \
      org.diamondgate.python="3.11.9" \
      org.diamondgate.python_amd64_manifest="sha256:2856e6af199e8128161abd320575eb9b341f3b76f017b5d0c9cd364f60d8a050" \
      org.diamondgate.vtk="9.3.0"
