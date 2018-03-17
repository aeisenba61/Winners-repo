--create table stateLevelMc as
SELECT
stName
,Case WHEN stName = 'District of Columbia' then 'DC' else Abbrev end as abbrev
	,sum(popEstimate2016) as pop2016
	,sum(obesity_n) as obesity_n
	,sum(obesity_n) / sum(obesity_pop) * 100 as stObesityPer
	,sum(diab_n) as diab_n
	,sum(diab_n) / sum(diab_pop)  * 100 as stDiabPer
	,sum(pop2010) as statePop2010	
	,sum(ohu2010) as housingUnits2010	
	,sum(medianFamilyIncome) as medFamIncome
	,sum(lapop20) as lapop20
	,sum(lalowi20) as lalowi20
	,sum(lasnap20) as lasnap20
	,sum(tractLOWI) as tractLOWI
	,sum(tractSNAP) as tractSNAP
	,avg(lapop20_share) as lapop20_share
	,avg(lalowi20_share) as lalowi20_share
	,avg(lasnap20_share) as lasnap20_share
	,sum(mccount)/sum(popEstimate2016) as mcd_per_cap
	,sum(tractLOWI) / sum(popEstimate2016) *100 as lowipopst_low_inc_pop_per
	,sum(tractSNAP) / sum(ohu2010) *100 as st_snap_households_per
	,sum(mccount) as mcCount	
FROM DATA_MCDS
group by stName,Case WHEN stName = 'District of Columbia' then 'DC' else Abbrev end
