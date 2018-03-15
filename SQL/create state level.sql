create table stateLevelMc as 
SELECT distinct 
	 stName
	,Case WHEN stName = 'District of Columbia' then 'DC' else Abbrev end as Abbrev
	,sum(popEstimate2016) as pop2016
	,sum(obesity_n) as obesity_n
	,sum(obesity_pop) / sum(obesity_n) as obesity_per
	,sum(diab_n) as diab_n
	,sum(diab_pop) / sum(diab_n) as diab_per	
	,sum(pop2010) as statePop2010	
	,sum(ohu2010) as housingUnits2010	
	,sum(medianFamilyIncome) as medFamIncome
	,sum(lapop20) as lapop20
	,sum(lalowi20) as lalowi20
	,sum(lasnap20) as lasnap20
	,sum(tractLOWI) as tractLOWI
	,sum(tractSNAP) as tractSNAP
	,sum(lapop20_share) as lapop20_share
	,sum(lalowi20_share) as lalowi20_share
	,sum(lasnap20_share) as lasnap20_share
	,sum(popEstimate2016)/sum(mccount) as mcd_per_cap
	,sum(mccount) as mcCount
	,PRIMARY KEY(`stName`)
	FROM DATA_MCDS
	group by stName,Abbrev