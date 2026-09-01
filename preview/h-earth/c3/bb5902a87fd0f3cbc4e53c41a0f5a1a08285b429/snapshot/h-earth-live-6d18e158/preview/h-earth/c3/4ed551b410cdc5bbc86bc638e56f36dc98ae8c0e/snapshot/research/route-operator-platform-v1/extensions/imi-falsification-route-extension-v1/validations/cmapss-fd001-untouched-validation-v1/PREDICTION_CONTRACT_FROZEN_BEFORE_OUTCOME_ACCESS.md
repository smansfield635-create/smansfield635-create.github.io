# IMI C-MAPSS Untouched Validation Contract v1

CONTRACT_ID = IMI_CMAPSS_FD001_FACTORIAL_TEMPORAL_RUL_UNTOUCHED_VALIDATION_v1
STATUS = FROZEN_BEFORE_TEST_OUTCOME_ACCESS
DATA_SOURCE = NASA C-MAPSS Turbofan Engine Degradation Simulation, FD001
DEVELOPMENT_SET = train_FD001.txt (100 complete run-to-failure trajectories)
UNTOUCHED_VALIDATION_FEATURE_SET = test_FD001.txt (100 truncated trajectories)
UNTOUCHED_VALIDATION_OUTCOME = RUL_FD001.txt
OUTCOME_ACCESS_RULE = RUL_FD001.txt MUST NOT BE OPENED OR PARSED UNTIL ALL FEATURE DEFINITIONS, MODEL CLASSES, HYPERPARAMETER PROCEDURES, MATERIAL MARGINS, AND ANALYSIS CODE ARE FROZEN AND HASHED.

## Scope

This contract tests a bounded utility claim. It does not test support dependence, substitution, route identity, restoration, successor formation, or the universal parent theory.

PRIMARY_CLAIM = A factorial temporal representation derived from multidimensional intrinsic condition (current constraint severity, direction, and persistence) materially improves untouched remaining-useful-life prediction beyond an age-only baseline.

MULTIPLICATIVE_SPECIFICITY_CLAIM = The multiplicative IMI severity representation materially outperforms the corresponding additive severity representation under identical temporal features and fitting procedures.

## Factor architecture

1. Use FD001 only (one operating condition and one fault mode).
2. Determine candidate sensors from training data only.
3. Exclude sensors with near-zero training variability.
4. Determine degradation direction from the training-set early-versus-late median difference.
5. Require absolute training monotonicity with normalized life progress >= 0.40.
6. Prevent duplicate-factor overweighting by retaining one sensor from any absolute-correlation cluster >= 0.95, choosing the sensor with stronger training monotonicity.
7. Construct each availability factor a_i in [0,1] using training-only robust nominal and degraded anchors:
   severity_i = clip(direction_i * (x_i - nominal_i) / scale_i, 0, 1)
   availability_i = 1 - severity_i
   nominal_i = pooled median of first 20 percent of each training trajectory
   degraded_anchor_i = pooled median of final 10 percent of each training trajectory
   scale_i = direction_i * (degraded_anchor_i - nominal_i), required > 0
8. Multiplicative condition severity: CS = 1 - product(a_i).
9. Additive condition severity: MEAN_SEVERITY = mean(1-a}¤¤¸(ÄÈ¸]•…­•ÍÐµ™…Ñ½ÈÍ•Ù•É¥Ñäè]-MQ}MYI%Qd€ô€Ä€´µ¥¸¡…}¤¤¸(ÄÄ¸¥É•Ñ¥½¸è½É‘¥¹…Éäµ±•…ÍÐµÍÅÕ…É•ÌÍ±½Á”½˜Ñ¡”É•±•Ù…¹ÐÍ•Ù•É¥Ñä½Ù•ÈÑ¡”™¥¹…°µ¥¸ ÄÀ°½‰Í•ÉÙ•‘}å±•Ì¤å±•Ì¸(ÄÈ¸A•ÉÍ¥ÍÑ•¹”è™É…Ñ¥½¸½˜Á½Í¥Ñ¥Ù”Í•Ù•É¥Ñä¥¹É•µ•¹ÑÌ½Ù•ÈÑ¡”™¥¹…°µ¥¸ ÄÀ°½‰Í•ÉÙ•‘}å±•Ì¤å±•Ì¸(ÄÌ¸U9-9=]8½U9Y1U	1¥ÌÉ•ÅÕ¥É•¥˜™•Ý•ÈÑ¡…¸€Ì½‰Í•ÉÙ•å±•Ì•á¥ÍÐ½È¹¼™…Ñ½ÉÌÍÕÉÙ¥Ù”ÑÉ…¥¹¥¹œ…‘µ¥ÍÍ¥½¸¸((ŒŒ•Ù•±½Áµ•¹ÐÍ…µÁ±¥¹œ()½È•… ½µÁ±•Ñ”ÑÉ…¥¹¥¹œ•¹¥¹”°½¹ÍÑÉÕÐ‘•Ñ•Éµ¥¹¥ÍÑ¥ŒÁÍ•Õ‘¼µÑ•ÍÐ•¹‘Á½¥¹ÑÌ…Ð€ÐÀ”°€ÔÔ”°€ÜÀ”°€àÀ”°…¹€äÀ”½˜½‰Í•ÉÙ•±¥™•Ñ¥µ”€¡™±½½È°µ¥¹¥µÕ´å±”€Ì¤¸Q…É•Ð¥ÌÑÉÕ”å±•ÌÉ•µ…¥¹¥¹œ…ÐÑ¡…Ð•¹‘Á½¥¹Ð¸9¼Ñ•ÍÐ½ÕÑ½µ•ÌÁ…ÉÑ¥¥Á…Ñ”¥¸™•…ÑÕÉ”Í•±•Ñ¥½¸°¹½Éµ…±¥é…Ñ¥½¸°µ½‘•°™¥ÑÑ¥¹œ°½È¡åÁ•ÉÁ…É…µ•Ñ•ÈÍ•±•Ñ¥½¸¸((ŒŒ½µÁ•Ñ¥¹œµ½‘•±Ì()0Á}}=91dèÕÉÉ•¹Ðå±”½¹±ä¸)0Å}%5%}=9%Q%=8èå±”€¬µÕ±Ñ¥Á±¥…Ñ¥Ù”L¸)0Å}%5%}Q=I%0èå±”€¬µÕ±Ñ¥Á±¥…Ñ¥Ù”L€¬L‘¥É•Ñ¥½¸€¬LÁ•ÉÍ¥ÍÑ•¹”¸)4Í}%Q%Y}Q=I%0èå±”€¬…‘‘¥Ñ¥Ù”µ•…¸Í•Ù•É¥Ñä€¬…‘‘¥Ñ¥Ù”‘¥É•Ñ¥½¸€¬…‘‘¥Ñ¥Ù”Á•ÉÍ¥ÍÑ•¹”¸)4Ñ}]-MQ}Q=I%0èå±”€¬Ý•…­•ÍÐÍ•Ù•É¥Ñä€¬Ý•…­•ÍÐ‘¥É•Ñ¥½¸€¬Ý•…­•ÍÐÁ•ÉÍ¥ÍÑ•¹”¸)4Õ}U11}M9M=I}I%èå±”€¬…‘µ¥ÑÑ•ÕÉÉ•¹ÐÍ•¹Í½ÈÍ•Ù•É¥Ñ¥•Ì€¬…‘µ¥ÑÑ•Í•¹Í½ÈÍ±½Á•Ì½Ù•ÈÑ¡”™¥¹…°€ÄÀå±•Ì¸()±°µ½‘•±ÌÕÍ”I¥‘”É•É•ÍÍ¥½¸Ý¥Ñ ¥¹Ñ•É•ÁÐ¸±Á¡„¥ÌÍ•±•Ñ•¥¹‘•Á•¹‘•¹Ñ±ä™½È•… µ½‘•°™É½´ìÀ°€À¸ÀÄ°€À¸Ä°€Ä°€ÄÀ°€ÄÀÁô‰äÉ½ÕÁ•™¥Ù”µ™½±É½ÍÌµÙ…±¥‘…Ñ¥½¸½¸ÑÉ…¥¹¥¹œ•¹¥¹•Ì½¹±ä°µ¥¹¥µ¥é¥¹œI5M¸%‘•¹Ñ¥…°‘•Ù•±½Áµ•¹ÐÉ½ÝÌ…¹™½±‘Ì…É”ÕÍ•™½È•Ù•Éäµ½‘•°¸((ŒŒAÉ¥µ…Éä½ÕÑ½µ”…¹µ•ÑÉ¥Ì()=UQ=5€ôÑÉÕ”É•µ…¥¹¥¹œÕÍ•™Õ°±¥™”¥¸å±•Ì™½È•… ½˜€ÄÀÀÀÀÄÑ•ÍÐ•¹¥¹•Ì¸)AI%5Ie}5QI%€ôI5M¸)M=9Ie}5QI%L€ô5°MÁ•…Éµ…¸½ÉÉ•±…Ñ¥½¸°…±¥‰É…Ñ¥½¸¥¹Ñ•É•ÁÐ°…±¥‰É…Ñ¥½¸Í±½Á”¸)A%I}=5AI%M=8€ô•¹¥¹”µ±•Ù•°ÍÅÕ…É•µ•ÉÉ½È…¹…‰Í½±ÕÑ”µ•ÉÉ½È‘¥™™•É•¹•Ì¸)U9IQ%9Qd€ôÁ…¥É••¹¥¹”‰½½ÑÍÑÉ…À°€ÄÀ°ÀÀÀÉ•Í…µÁ±•Ì°™¥á•Í••€ÈÔØ°É•Á½ÉÑ¥¹œ€äÔ”½¹™¥‘•¹”¥¹Ñ•ÉÙ…±Ì¸((ŒŒ5…Ñ•É¥…±¥Ñä…¹…‘©Õ‘¥…Ñ¥½¸()µ½‘•°µ…Ñ•É¥…±±ä¥µÁÉ½Ù•Ì½¸„½µÁ…É…Ñ½È½¹±ä¥˜è(Ä¸I5MÉ•±…Ñ¥Ù”¥µÁÉ½Ù•µ•¹Ð¥Ì…Ð±•…ÍÐ€Ô”ì9(È¸Ñ¡”Á…¥É•‰½½ÑÍÑÉ…À€äÔ”$™½ÈI5M¥µÁÉ½Ù•µ•¹Ð¥ÌÉ•…Ñ•ÈÑ¡…¸€À¸()Q=I%1}Q5A=I1}UQ%1%Qe}MUAA=IQ¥˜4Èµ…Ñ•É¥…±±ä¥µÁÉ½Ù•Ì½Ù•È4À…¹4Ä¸)5U1Q%%59M%=91}=9%Q%=9}UQ%1%Qe}MUAA=IQ¥˜4Äµ…Ñ•É¥…±±ä¥µÁÉ½Ù•Ì½Ù•È4À¸)5U1Q%A1%Q%Y}MA%%%Qe}MUAA=IQ¥˜4Èµ…Ñ•É¥…±±ä¥µÁÉ½Ù•Ì½Ù•È4Ì¸)=AIQ=I}9=Q}%MQ%9U%M!¥˜4È¥µÁÉ½Ù•Ì½Ù•È4À‰ÕÐ‘½•Ì¹½Ðµ…Ñ•É¥…±±ä¥µÁÉ½Ù”½Ù•È4Ì¸)U11}=5A1a%Qe}IU99P¥˜4Ô‘½•Ì¹½Ðµ…Ñ•É¥…±±ä¥µÁÉ½Ù”½Ù•ÈÑ¡”‰•ÍÐ½µÁÉ•ÍÍ•µ½‘•°¸)1%5}9=Q}MUAA=IQ¥˜4È‘½•Ì¹½Ðµ…Ñ•É¥…±±ä¥µÁÉ½Ù”½Ù•È4À¸((ŒŒA•ÉÍ½¹…°½¹Ñ¥¹Õ…Ñ¥½¸¥¹Ñ•ÉÁÉ•Ñ…Ñ¥½¸€¡½ÕÑÍ¥‘”Í¥•¹Ñ¥™¥Œ‘¥ÍÁ½Í¥Ñ¥½¸¤()=9Q%9U¥ÌÍÕÁÁ½ÉÑ•¥˜Õ¹Ñ½Õ¡•Ù…±¥‘…Ñ¥½¸•ÍÑ…‰±¥Í¡•Ì…Ð±•…ÍÐ½¹”µ…Ñ•É¥…°‘¥ÍÑ¥¹Ñ¥Ù”…‘Ù…¹Ñ…”™½È4È½Ù•ÈÍ¥µÁ±”‰…Í•±¥¹•ÌÝ¥Ñ¡½ÕÐ‰•¥¹œ‘½µ¥¹…Ñ•‰ä4Ì½È4Ô¸)9II=\¥ÌÍÕÁÁ½ÉÑ•¥˜µÕ±Ñ¥‘¥µ•¹Í¥½¹…°½ÈÑ•µÁ½É…°¥¹™½Éµ…Ñ¥½¸¥ÌÕÍ•™Õ°‰ÕÐµÕ±Ñ¥Á±¥…Ñ¥½¸¥Ì¹½Ð‘¥ÍÑ¥¹Ñ¥Ù”°½È¥˜½¹±äÑ¡”™Õ±°Í•¹Í½Èµ½‘•°Á•É™½ÉµÌµ…Ñ•É¥…±±ä‰•ÑÑ•È¸)MQ=A}=I}U959Q11e}IM%8¥ÌÍÕÁÁ½ÉÑ•¥˜¹¼%5$µ‘•É¥Ù•½µÁÉ•ÍÍ•µ½‘•°µ…Ñ•É¥…±±ä¥µÁÉ½Ù•Ì½Ù•È…”µ½¹±ä…¹…‘‘¥Ñ¥Ù”½Í¥µÁ±”…±Ñ•É¹…Ñ¥Ù•Ì½¸Õ¹Ñ½Õ¡•½ÕÑ½µ•Ì¸()Q¡¥ÌÁ•ÉÍ½¹…°¥¹Ñ•ÉÁÉ•Ñ…Ñ¥½¸‘½•Ì¹½Ð…±Ñ•ÈÍ¥•¹Ñ¥™¥Œµ•ÑÉ¥Ì½È‘¥ÍÁ½Í¥Ñ¥½¹Ì¸(