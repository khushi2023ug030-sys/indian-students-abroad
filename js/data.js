/* Minds Adrift · data (all secondary sources)
   DESTINATIONS: MEA reply to Parliament, 2024 (stock, Indian students abroad). 108 countries; 20 listed here.
   STATES: Students going abroad by state, 2016–2020 (Bureau of Immigration data, as tabulated by Careers360 from MEA/BoI).
   Note: the state map uses pre-2014 boundaries; "Andhra Pradesh" includes Telangana, which is recorded separately only from 2019. */
window.DATA = {
  total: 1335878, countries: 108,
  dest: [
    { k:'Canada', map:'Canada', v:427000, ll:[-96,56] },
    { k:'USA', map:'United States of America', v:337630, ll:[-98,39] },
    { k:'UK', map:'United Kingdom', v:185000, ll:[-2,53.5] },
    { k:'Australia', map:'Australia', v:122202, ll:[134,-25] },
    { k:'Germany', map:'Germany', v:42997, ll:[10.4,51.2] },
    { k:'UAE', map:'United Arab Emirates', v:25000, ll:[54,24] },
    { k:'Russia', map:'Russia', v:24940, ll:[45,55] },
    { k:'Kyrgyzstan', map:'Kyrgyzstan', v:16500, ll:[74.7,41.2] },
    { k:'Georgia', map:'Georgia', v:16093, ll:[43.4,42.3] },
    { k:'Kazakhstan', map:'Kazakhstan', v:9785, ll:[67,48] },
    { k:'Philippines', map:'Philippines', v:9665, ll:[122,12] },
    { k:'France', map:'France', v:9500, ll:[2.2,46.6] },
    { k:'China & HK', map:'China', v:8580, ll:[104,35] },
    { k:'New Zealand', map:'New Zealand', v:7300, ll:[172,-41] },
    { k:'Ireland', map:'Ireland', v:7000, ll:[-8,53.4] },
    { k:'Italy', map:'Italy', v:6017, ll:[12.5,42.8] },
    { k:'Malaysia', map:'Malaysia', v:4029, ll:[102,4] },
    { k:'Singapore', map:null, v:2000, ll:[103.8,1.35] },
    { k:'South Korea', map:'South Korea', v:1985, ll:[127.8,36.3] },
    { k:'Japan', map:'Japan', v:1322, ll:[138,36] }
  ],
  india: [79,22],
  years: [2016,2017,2018,2019,2020],
  states: {
    'Andhra Pradesh':[46818,56093,62771,69465,35614],'Punjab':[36743,52160,60331,73574,33412],'Maharashtra':[45560,56640,58850,64653,29079],
    'Gujarat':[24775,33751,41413,48051,23156],'Delhi':[27016,32051,35844,40934,18482],'Tamil Nadu':[27518,36261,38983,41488,15564],
    'Kerala':[18428,22093,26456,30948,15277],'Chandigarh':[18916,23257,26211,32528,13988],'Karnataka':[17719,24030,26918,29314,13699],
    'Uttar Pradesh':[13776,16949,20246,21941,8618],'Haryana':[5284,7374,9802,12709,6944],'West Bengal':[8495,12593,14759,15966,6335],
    'Rajasthan':[10698,14431,16897,17287,5557],'Jammu and Kashmir':[3203,6067,8036,9150,4275],'Madhya Pradesh':[5190,6479,7583,8285,3284],
    'Uttaranchal':[2611,3149,3719,3982,1789],'Bihar':[2352,3345,4399,4888,1384],'Assam':[2469,3056,3948,4291,1378],'Orissa':[1932,2462,2757,2982,1140],
    'Jharkhand':[1677,2147,2333,2519,884],'Chhattisgarh':[1676,2134,2565,2681,801],'Himachal Pradesh':[1832,2114,2297,2247,779],
    'Goa':[979,1138,1244,1247,501],'Manipur':[245,576,1199,1475,343],'Puducherry':[0,48,189,376,202],'Nagaland':[42,109,195,347,124],
    'Meghalaya':[67,151,242,308,96],'Sikkim':[36,81,169,211,87],'Tripura':[13,47,110,180,75],'Arunachal Pradesh':[11,45,65,94,30],'Mizoram':[20,93,78,96,28]
  },
  display: { 'Uttaranchal':'Uttarakhand', 'Orissa':'Odisha', 'Jammu and Kashmir':'J&K' }
};
