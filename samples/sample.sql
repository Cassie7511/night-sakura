-- Bloom rate by tree variety: a sample file for previewing the theme.
WITH observations AS (
    SELECT
        o.observation_id,
        o.variety,
        CASE WHEN o.stage = 'full' THEN 1 ELSE 0 END AS in_bloom,
        COALESCE(o.petal_count, 0)::numeric(10, 2)  AS petals
    FROM bloom_observations AS o
    WHERE o.verified = TRUE
      AND o.observed_on >= DATE '2026-03-15'
)
SELECT
    variety,
    COUNT(*)                          AS n,
    ROUND(AVG(in_bloom) * 100, 1)     AS bloom_pct,
    SUM(petals) / NULLIF(COUNT(*), 0) AS petals_per_observation
FROM observations
GROUP BY variety
HAVING COUNT(*) >= 10
ORDER BY petals_per_observation DESC;
