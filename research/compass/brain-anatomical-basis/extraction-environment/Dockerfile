FROM python:3.11.9-slim-bookworm@sha256:2856e6af199e8128161abd320575eb9b341f3b76f017b5d0c9cd364f60d8a050
RUN python -m pip install --no-cache-dir --disable-pip-version-check 'vtk==9.3.0'
LABEL org.diamondgate.contract="GEN1_VTK_STAGE_V1" \
      org.diamondgate.python="3.11.9" \
      org.diamondgate.python.linux_amd64_manifest="sha256:2856e6af199e8128161abd320575eb9b341f3b76f017b5d0c9cd364f60d8a050" \
      org.diamondgate.vtk="9.3.0"
