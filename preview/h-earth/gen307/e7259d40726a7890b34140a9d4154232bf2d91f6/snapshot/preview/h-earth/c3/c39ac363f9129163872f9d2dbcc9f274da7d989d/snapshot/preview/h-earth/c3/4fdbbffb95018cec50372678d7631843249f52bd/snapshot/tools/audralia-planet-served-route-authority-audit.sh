# TARGET FILE: /tools/audralia-planet-served-route-authority-audit.sh
# TNT FULL-FILE REPLACEMENT
# AUDRALIA_PLANET_SERVED_ROUTE_DEPLOYMENT_AUTHORITY_AUDIT_ACTION_TNT_v1
#
# Purpose:
# Identify why /showroom/globe/audralia/planet/ is not serving the HTML file
# that was installed locally.
#
# Owns:
# - source/output/public HTTP marker comparison
# - direct-index vs trailing-slash comparison
# - Blueprint asset presence checks
#
# Does not own:
# - rewriting HTML
# - rewriting Blueprint assets
# - changing renderplex/canvas/UI files
# - clearing cache
# - deploying
# - modifying the website

#!/usr/bin/env bash
set -u

CONTRACT="AUDRALIA_PLANET_SERVED_ROUTE_DEPLOYMENT_AUTHORITY_AUDIT_ACTION_TNT_v1"

TARGET_ROUTE="https://diamondgatebridge.com/showroom/globe/audralia/planet/"
TARGET_INDEX="https://diamondgatebridge.com/showroom/globe/audralia/planet/index.html"

EXPECTED_HTML_MARKER="AUDRALIA_PLANET_HTML_MANOR_BLUEPRINT_TEST_ROUTE_INSTALL_CACHE_CATCH_TNT_v2"
EXPECTED_VISIBLE_MARKER="Blueprint cache catch v2"
EXPECTED_BOOTSTRAP_KEY="MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_TNT_v1__AUDRALIA_PLANET_HTML_CACHE_CATCH_v2"

BOOTSTRAP_URL="https://diamondgatebridge.com/assets/site.bootstrap.js?v=MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_TNT_v1__AUDRALIA_PLANET_HTML_CACHE_CATCH_v2"
REGISTRY_URL="https://diamondgatebridge.com/assets/manor-blueprint/manor.blueprint.registry.js?v=MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1"
CSS_URL="https://diamondgatebridge.com/assets/manor-blueprint/manor.blueprint.css?v=MANOR_BLUEPRINT_FIXED_BUBBLE_FULLSCREEN_OVERLAY_CSS_TNT_v1"
HUD_JS_URL="https://diamondgatebridge.com/assets/manor-blueprint/manor.blueprint.js?v=MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1"

LOCAL_SOURCE="./showroom/globe/audralia/planet/index.html"

OUTPUT_CANDIDATES=(
  "./public/showroom/globe/audralia/planet/index.html"
  "./dist/showroom/globe/audralia/planet/index.html"
  "./build/showroom/globe/audralia/planet/index.html"
  "./out/showroom/globe/audralia/planet/index.html"
  "./_site/showroom/globe/audralia/planet/index.html"
)

TMP_DIR="${TMPDIR:-/tmp}/audralia-route-audit"
mkdir -p "$TMP_DIR"

ROUTE_HTML="$TMP_DIR/trailing-route.html"
INDEX_HTML="$TMP_DIR/direct-index.html"
BOOTSTRAP_JS="$TMP_DIR/site.bootstrap.js"
REGISTRY_JS="$TMP_DIR/manor.blueprint.registry.js"
CSS_FILE="$TMP_DIR/manor.blueprint.css"
HUD_JS="$TMP_DIR/manor.blueprint.js"

pass() { printf "PASS  %s\n" "$1"; }
fail() { printf "FAIL  %s\n" "$1"; }
hold() { printf "HOLD  %s\n" "$1"; }
info() { printf "INFO  %s\n" "$1"; }

contains_marker() {
  local file="$1"
  local marker="$2"

  if [ ! -f "$file" ]; then
    return 2
  fi

  grep -Fq "$marker" "$file"
}

http_fetch() {
  local url="$1"
  local out="$2"

  curl -L -sS \
    -H "Cache-Control: no-cache" \
    -H "Pragma: no-cache" \
    "$url" \
    -o "$out"
}

http_status() {
  local url="$1"

  curl -L -sS \
    -o /dev/null \
    -w "%{http_code}" \
    -H "Cache-Control: no-cache" \
    -H "Pragma: no-cache" \
    "$url"
}

asset_check() {
  local label="$1"
  local url="$2"
  local out="$3"
  local marker="$4"

  local code
  code="$(http_status "$url")"

  if [ "$code" != "200" ]; then
    fail "$label HTTP status is $code"
    return 1
  fi

  http_fetch "$url" "$out"

  if contains_marker "$out" "$marker"; then
    pass "$label is reachable and contains expected marker"
    return 0
  fi

  fail "$label is reachable but does not contain expected marker"
  return 1
}

printf "\n%s\n" "══════════════════════════════════════════════════════════════════════"
printf "%s\n" "$CONTRACT"
printf "%s\n" "TARGET_ROUTE=$TARGET_ROUTE"
printf "%s\n" "EXPECTED_HTML_MARKER=$EXPECTED_HTML_MARKER"
printf "%s\n" "══════════════════════════════════════════════════════════════════════"
printf "\n"

printf "%s\n" "SECTION 1 — SOURCE FILE PROOF"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

if [ -f "$LOCAL_SOURCE" ]; then
  info "Local source exists: $LOCAL_SOURCE"

  if contains_marker "$LOCAL_SOURCE" "$EXPECTED_HTML_MARKER"; then
    pass "Local source contains v2 HTML marker"
  else
    fail "Local source does not contain v2 HTML marker"
    printf "\nCLASSIFICATION=CLASS_A_SOURCE_SAVE_FAILURE\n"
    exit 0
  fi

  if contains_marker "$LOCAL_SOURCE" "$EXPECTED_BOOTSTRAP_KEY"; then
    pass "Local source contains v2 bootstrap cache key"
  else
    fail "Local source does not contain v2 bootstrap cache key"
    printf "\nCLASSIFICATION=CLASS_A_SOURCE_SAVE_FAILURE\n"
    exit 0
  fi
else
  hold "Local source path not found from current working directory: $LOCAL_SOURCE"
fi

printf "\n%s\n" "SECTION 2 — BUILD / PUBLIC OUTPUT FILE PROOF"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

found_output="false"
output_has_marker="false"

for candidate in "${OUTPUT_CANDIDATES[@]}"; do
  if [ -f "$candidate" ]; then
    found_output="true"
    info "Found output candidate: $candidate"

    if contains_marker "$candidate" "$EXPECTED_HTML_MARKER"; then
      pass "Output candidate contains v2 HTML marker: $candidate"
      output_has_marker="true"
    else
      fail "Output candidate does not contain v2 HTML marker: $candidate"
    fi
  fi
done

if [ "$found_output" = "false" ]; then
  hold "No common build/public output candidate found from current working directory"
else
  if [ "$output_has_marker" = "false" ]; then
    printf "\nCLASSIFICATION=CLASS_B_BUILD_OUTPUT_FAILURE\n"
    exit 0
  fi
fi

printf "\n%s\n" "SECTION 3 — PUBLIC TRAILING ROUTE RESPONSE PROOF"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

route_code="$(http_status "$TARGET_ROUTE")"
info "Trailing route HTTP status: $route_code"

if [ "$route_code" != "200" ]; then
  fail "Trailing route did not return 200"
  printf "\nCLASSIFICATION=CLASS_C_DEPLOY_OR_ROUTE_FAILURE\n"
  exit 0
fi

http_fetch "$TARGET_ROUTE" "$ROUTE_HTML"

if contains_marker "$ROUTE_HTML" "$EXPECTED_HTML_MARKER"; then
  pass "Trailing route contains v2 HTML marker"
else
  fail "Trailing route does not contain v2 HTML marker"
fi

if contains_marker "$ROUTE_HTML" "$EXPECTED_VISIBLE_MARKER"; then
  pass "Trailing route contains visible v2 cache-catch text"
else
  fail "Trailing route does not contain visible v2 cache-catch text"
fi

if contains_marker "$ROUTE_HTML" "$EXPECTED_BOOTSTRAP_KEY"; then
  pass "Trailing route contains v2 bootstrap cache key"
else
  fail "Trailing route does not contain v2 bootstrap cache key"
fi

printf "\n%s\n" "SECTION 4 — DIRECT INDEX RESPONSE PROOF"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

index_code="$(http_status "$TARGET_INDEX")"
info "Direct index HTTP status: $index_code"

if [ "$index_code" = "200" ]; then
  http_fetch "$TARGET_INDEX" "$INDEX_HTML"

  if contains_marker "$INDEX_HTML" "$EXPECTED_HTML_MARKER"; then
    pass "Direct index contains v2 HTML marker"
  else
    fail "Direct index does not contain v2 HTML marker"
  fi

  if contains_marker "$INDEX_HTML" "$EXPECTED_BOOTSTRAP_KEY"; then
    pass "Direct index contains v2 bootstrap cache key"
  else
    fail "Direct index does not contain v2 bootstrap cache key"
  fi

  if cmp -s "$ROUTE_HTML" "$INDEX_HTML"; then
    pass "Trailing route and direct index serve identical HTML"
  else
    fail "Trailing route and direct index serve different HTML"
    printf "\nCLASSIFICATION=CLASS_E_REWRITE_TARGET_FAILURE\n"
    exit 0
  fi
else
  hold "Direct index did not return 200; trailing route may be rewrite-controlled"
fi

printf "\n%s\n" "SECTION 5 — ROUTE SERVED OBJECT CLASSIFICATION"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

route_has_v2="false"
index_has_v2="false"

if contains_marker "$ROUTE_HTML" "$EXPECTED_HTML_MARKER"; then
  route_has_v2="true"
fi

if [ -f "$INDEX_HTML" ] && contains_marker "$INDEX_HTML" "$EXPECTED_HTML_MARKER"; then
  index_has_v2="true"
fi

if [ "$route_has_v2" != "true" ]; then
  fail "Public route is still not serving v2 HTML"

  if [ "$found_output" = "true" ] && [ "$output_has_marker" = "true" ]; then
    printf "\nCLASSIFICATION=CLASS_D_CDN_OR_SERVER_CACHE_FAILURE\n"
  else
    printf "\nCLASSIFICATION=CLASS_C_DEPLOY_FAILURE_OR_WRONG_PUBLIC_TARGET\n"
  fi

  printf "NEXT_AUTHORITY_TARGET=deployment_output_or_server_cache_layer\n"
  exit 0
fi

pass "Public route is serving v2 HTML. Blueprint runtime may now be audited."

printf "\n%s\n" "SECTION 6 — BLUEPRINT STATIC ASSET PROOF"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

asset_fail="false"

asset_check "Bootstrap JS" "$BOOTSTRAP_URL" "$BOOTSTRAP_JS" "MANOR_BLUEPRINT_GLOBAL_BOOTSTRAP_TNT_v1" || asset_fail="true"
asset_check "Blueprint Registry JS" "$REGISTRY_URL" "$REGISTRY_JS" "MANOR_BLUEPRINT_ROUTE_REGISTRY_TNT_v1" || asset_fail="true"
asset_check "Blueprint CSS" "$CSS_URL" "$CSS_FILE" "MANOR_BLUEPRINT_FIXED_BUBBLE_FULLSCREEN_OVERLAY_CSS_TNT_v1" || asset_fail="true"
asset_check "Blueprint HUD JS" "$HUD_JS_URL" "$HUD_JS" "MANOR_BLUEPRINT_FIXED_DRAGGABLE_BUBBLE_FULLSCREEN_MAP_INSTRUCTIONS_TOGGLE_JS_TNT_v1" || asset_fail="true"

if [ "$asset_fail" = "true" ]; then
  printf "\nCLASSIFICATION=CLASS_F_BLUEPRINT_STATIC_ASSET_FAILURE\n"
  exit 0
fi

printf "\n%s\n" "SECTION 7 — FINAL CLASSIFICATION"
printf "%s\n" "──────────────────────────────────────────────────────────────────────"

pass "Public HTML serves v2"
pass "Bootstrap script key is present"
pass "Blueprint static assets are reachable"

printf "\nCLASSIFICATION=CLASS_F_RUNTIME_BROWSER_MOUNT_CHECK_REQUIRED\n"
printf "NEXT_CHECK=Browser console should inspect window.DGB_MANOR_BLUEPRINT_BOOTSTRAP_STATUS and window.DGB_MANOR_BLUEPRINT_STATUS\n"
printf "EXPECTED_BUBBLE_SELECTOR=[data-dgb-blueprint-bubble]\n"
printf "\nAUDIT_STATUS=COMPLETE\n"
