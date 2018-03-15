create table DATA_MCDS as 
select 
	 p.fips
	,p.stname
	,p.ctyname
	,p.abbrev
	,p.popestimate2016
	,case when o.obesity_per is null or o.obesity_per = 0 then 0 else o.obesity_n/(o.obesity_per/100) end as obesity_pop
	,o.obesity_n
	,o.obesity_per
	,case when o.diab_per is null or o.diab_per = 0 then 0 else o.diab_n/(o.diab_per/100) end as diab_pop
	,o.diab_n
	,o.diab_per
	,f.pop2010
	,f.ohu2010
	,f.medianfamilyincome
	,f.lapop20
	,f.lalowi20
	,f.lasnap20
	,f.tractlowi
	,f.tractsnap
	,f.lapop20_share
	,f.lalowi20_share
	,f.lasnap20_share
	,m.mccount
	,case when m.mccount is null or p.popestimate2016 = 0 then 0 else m.mccount/p.popestimate2016 end as mcd_per_cap
	,PRIMARY KEY(`fips`)
from population p 
	left join obeseDiabetes o on p.fips = o.fips
	left join foodDesert f on p.fips = f.fips
	left join countyMcdsCount m on p.fips = m.county_fips;