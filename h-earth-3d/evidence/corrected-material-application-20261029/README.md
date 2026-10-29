# Corrected material renderer comparison — Gen2971

Diagnostic candidate only. No visual acceptance, product merge, or publication.

Reuses the qualified numerical packet `H-Earth-corrected-material-application-20261029.zip`, SHA256 `5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c`, preserved by [issue6911 checkpoint](https://github.com/smansfield635-create/smansfield635-create.github.io/issues/6911#issuecomment-6505151944). No transport solve was repeated.

The application is `d=w*(L32-LsourceExact-c)`, with the frozen12m boundary taper, tau72m², and separately conserved original primitive domains. Export uses0.25m globally aligned per-source-parent charts, RGB8 signed decode `(rgb*255-128)/1024`, linear filtering, no mipmaps. Runtime duplicates selected triangle vertices without changing values or triangle order, and verifies SHA256 of original positions, indices, actually consumed post-seam normals and coast attributes before application. Source-only checks do not establish GPU equivalence.

The first export was rejected for discontinuous chart padding. The committed export pads through uniquely identified shared-index neighbours; actual triangle interiors retain their own source parent. Independent encoded-atlas review found zero shared-edge discrepancy across44,897 polynomial segments, numerical zero at external perimeter, and normalized mass residual below1e-5. Frozen-witness fidelity stays within0.23 display codes of the saved application. Microscopic original mesh overlaps remain a separate qualification track.

The bounded comparison is baseline plus candidate at inland-seam-near, inland-seam-far, protected-meadow and protected-coast, reference-lit only, with physical vegetation visible:8captured images maximum,1run, no automatic retries. Both presentations use the same immutable scene cb57c275b95d0d48883bc4da4dcfcf17cbec5060. The product renderer on disk is unchanged; response interception applies the candidate. Independent source qualification must pass before launch.

Reproduce export from the extracted numerical packet/workroom root using `python tools/h-earth-corrected-material-export.py --output renderer-export`. The packet supplies `source-reference.py`, original mesh, resolved-output and corrected-output; its source-reference dependencies must be available as recorded in the packet. Do not rerun the transport.
