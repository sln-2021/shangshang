//@ts-check
/// <reference path="../../types.d.ts" />

/*
  身分验证 图片 预览组件(上传成功了的图片预览)
*/

import React, { Fragment } from 'react';
import { Modal, Card, Avatar } from 'antd';
import styles from './index.less';

const imgPlaceholderNO = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';

const imgPlaceholder = {
  businessLicense: <svg t="1580750908221" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6585" width="200" height="150"><path d="M1002.597054 887.996472H20.228944c-5.960314 0-10.836934-4.876621-10.836934-10.836934V235.793633c0-5.960314 4.876621-10.836934 10.836934-10.836935h982.36811c5.960314 0 10.836934 4.876621 10.836935 10.836935v641.365905c0 5.960314-4.876621 10.836934-10.836935 10.836934zM371.165006 376.944704h-23.480025v-8.127701h-7.224623v8.127701h-29.259723v6.592469H340.460358v5.960314h7.224623v-5.960314h23.480025v5.960314h7.224623v-5.960314h29.711262v-6.592469H378.389629v-8.127701h-7.224623v8.127701z m-56.893906 15.171708v18.061558h7.495546v-11.559397h75.49731v11.559397h7.495547v-18.061558H314.2711z m8.308316 74.413617h7.495547v-4.966928h58.880677v4.966928h7.495546v-30.162801h-73.962078v30.162801z m7.134315-35.852191h7.495547v-2.257695h44.702354v2.257695h7.495547v-24.744334h-59.693448v24.744334z m59.332217 24.834641h-58.880678V442.508158h58.880678v13.004321z m-7.134316-33.233266h-44.702354v-10.20478h44.702354v10.20478z m30.162801 30.162801v7.314931h97.713026V452.442014H477.728195v-81.638239h-8.308317V452.442014h-17.339095v-81.638239h-8.308316V452.442014h-31.698034z m4.244466-59.1516c5.508775 13.45586 10.475703 27.182644 14.810477 40.999735l8.127701-3.612311c-4.786313-13.636476-10.024164-27.182644-15.713555-40.548197l-7.224623 3.160773z m72.065615 41.541582c5.508775-11.288473 11.378781-24.834642 17.51971-40.638505l-8.037393-3.160772c-4.515389 13.004321-10.024164 26.550489-16.616633 40.548196l7.134316 3.251081z m25.376488-4.425082l12.914013-3.792927v26.460182c0 3.070465-1.444925 4.605697-4.334773 4.605697-1.62554 0-4.605697-0.270923-8.850164-0.722462 0.541847 2.618926 0.993386 5.237852 1.26431 7.947085 4.06385 0.090308 7.585854 0.180616 10.385395 0.180616 5.870006 0 8.850163-3.612311 8.850163-10.746627V424.4466l11.469089-3.25108c-0.361231-2.528618-0.541847-4.966928-0.722462-7.495546-3.612311 0.993386-7.134315 1.986771-10.746627 2.980157v-21.22233h11.559397V388.323485h-11.559397v-19.054943h-7.314931V388.323485h-13.004321v7.134316h13.004321v23.209101c-4.605697 1.174001-9.301702 2.348002-13.907399 3.431696l0.993386 8.308316z m32.781727-13.184937c3.973543 2.709234 7.947085 5.418467 11.83032 8.127701-2.618926 13.184937-9.301702 24.654026-19.958021 34.407267 2.167387 2.077079 4.154158 4.334774 5.960314 6.773084 10.836934-10.024164 17.790634-22.0351 21.041714-36.213423 3.973543 2.889849 7.856777 5.779698 11.83032 8.759856l5.057236-6.863392c-5.057236-3.522004-10.20478-7.044007-15.352323-10.475703 1.083693-7.585854 1.715848-16.255402 1.896463-25.828028h19.506482c0 10.024164 0 19.416174 0.090308 28.085722-0.090308 15.262016 0.632155 25.557104 2.167387 30.885264 1.896464 6.231237 5.057236 9.301702 9.482317 9.301702 4.334774 0 7.314931-2.799541 8.940471-8.398625 1.174001-4.334774 2.257695-9.843549 3.160773-16.436017-2.257695-0.541847-4.696005-1.535232-7.314931-2.889849-0.81277 6.863392-1.715848 12.101243-2.618926 15.803863-0.361231 1.715848-1.083693 2.618926-1.986771 2.618926-0.903078 0-1.62554-0.722462-2.077079-2.167387-1.806156-6.14093-2.528618-18.242173-2.257695-36.484346l0.270924-27.814799h-27.182644c0.180616-6.321545 0.270923-12.733398 0.270923-19.054943h-7.676162c-0.090308 6.682776-0.180616 13.004321-0.270923 19.054943h-11.83032v7.495546h11.740012c-0.180616 8.037393-0.632155 15.0814-1.354617 21.041715-2.889849-1.896464-5.689391-3.702619-8.488932-5.599083l-4.87662 5.870006z m79.470852 24.473411c-2.257695 5.870006-5.779698 13.004321-10.656318 21.132022 2.43831 1.083693 4.786313 2.167387 7.044007 3.160772 4.605697-8.308316 8.218009-15.532939 10.656319-21.673869l-7.044008-2.618925z m-5.68939-2.348003h7.314931v-4.425081h17.248787v3.792927h7.314931v-64.570068H620.414499v65.202222z m24.563718-38.561425H627.639122v-19.958021h17.248787v19.958021z m-17.248787 6.773084h17.248787v20.680483H627.639122v-20.680483z m15.171708 38.471117c3.160773 6.050622 6.050622 12.281859 8.57924 18.603405l7.134315-3.160773c-2.528618-5.689391-5.599083-11.83032-9.211394-18.332481l-6.502161 2.889849z m28.446953-65.744069c0.090308 10.295088-5.328159 18.332481-16.255402 24.112179 1.806156 1.806156 3.522004 3.792927 5.147544 5.779699 12.101243-6.682776 18.151865-16.706941 18.332481-29.891878h20.770791c0 2.528618-0.180616 6.14093-0.541847 10.836935-0.361231 3.792927-2.618926 5.779698-6.773084 5.779698-2.709234 0-6.682776-0.361231-11.920628-0.993386 0.541847 2.618926 1.083693 5.237852 1.444925 7.76647 5.147544 0.180616 9.030779 0.270923 11.649704 0.270924 7.947085 0 12.191551-4.154158 12.823706-12.372167 0.451539-5.960314 0.81277-11.920628 0.993386-17.880942h-47.863127v6.592468h12.191551z m-8.759855 59.151601h7.31493v-3.070465h29.350031v3.070465h7.314931v-30.433724h-43.979892v30.433724z m5.68939 5.870006c3.25108 5.960314 6.231237 12.101243 8.940471 18.332481l7.044007-3.341388c-2.889849-6.050622-6.050622-12.010936-9.482317-17.790634l-6.502161 2.799541z m31.065879-15.262016h-29.350031v-14.720169h29.350031v14.720169z m-7.134315 14.449246c4.244466 6.231237 8.218009 12.733398 11.83032 19.416174l6.863392-4.06385c-3.792927-6.592468-7.947085-12.914014-12.462475-19.054943l-6.231237 3.702619zM99.338566 573.635065h360.147456v-14.900785H99.338566v14.900785z m0 65.653761h306.324014v-14.900785H99.338566v14.900785z m0 65.563454h306.324014V689.951495H99.338566v14.900785z m0 65.653761h360.147456v-14.900785H99.338566v14.900785z m463.369257-196.870976h360.147455v-14.900785H562.707823v14.900785zM614.6348 639.288826h308.13017v-14.900785H614.6348v14.900785z m0 65.563454h308.13017V689.951495H614.6348v14.900785z m-51.926977 65.653761h360.147455v-14.900785H562.707823v14.900785z m37.477731-547.174883c0-48.224358-39.103272-87.32763-87.417938-87.417938-48.314666 0-87.417938 39.103272-87.417938 87.417938s39.103272 87.417938 87.417938 87.417938 87.417938-39.19358 87.417938-87.417938zM519.901931 204.095599l-7.044007-5.147544-7.044007 5.147544 2.709233-8.308316-7.044007-5.147544h8.669547l2.709234-8.308316 2.709234 8.308316h8.759855l-7.044007 5.147544 2.618925 8.308316z m-21.583561-3.522003l-3.160772 2.709233 1.62554 3.792927-3.612312-2.167387-3.160772 2.709234 0.993385-4.06385-3.612311-2.167387 4.154158-0.361232 0.993386-4.06385 1.62554 3.883235 4.154158-0.270923z m8.398624 12.462474l3.883235 1.62554-4.06385 0.993386-0.270923 4.154158-2.167387-3.522003-4.063851 0.993385 2.709234-3.160772-2.167387-3.522004 3.883235 1.62554 2.709233-3.160772-0.451539 3.973542z m16.706941 1.174001l2.709234 3.160773-4.063851-0.993386-2.167387 3.612312-0.361231-4.154158-4.06385-0.993386 3.883235-1.62554-0.361231-4.154158 2.709233 3.160772 3.883235-1.62554-2.167387 3.612311z m14.900785-12.64309l-3.522004 2.167387 0.993386 4.063851-3.160773-2.709234-3.522003 2.167387 1.62554-3.883235-3.160773-2.709234 4.154159 0.270924 1.62554-3.883235 0.993385 4.06385 3.973543 0.451539z m26.821413 19.145251c0 14.178323-5.689391 27.724491-15.894171 37.56804l2.348003 10.295087c0 4.515389-3.612311 9.753241-8.127701 9.753241H482.243584c-4.515389 0-8.127701-5.237852-8.127701-9.753241l2.167387-10.475703c-9.753241-9.482318-15.803863-22.757562-15.803863-37.387424 0-28.898492 23.480025-52.288209 52.378517-52.288209s52.288209 23.389717 52.288209 52.288209z m-52.288209 38.742041c9.843549 0.090308 19.235559-3.702619 26.460182-10.385396h-52.920364c7.134315 6.682776 16.616633 10.385396 26.460182 10.385396z m30.433724-14.720169c5.418467-6.863392 8.398624-15.352324 8.57924-24.021872 0-21.493253-17.429403-38.832349-38.832348-38.832348-21.493253 0-38.832349 17.429403-38.832349 38.832348-0.090308 8.669548 2.889849 17.15848 8.308316 24.021872l0.993386-4.425082h14.539554v-3.431696H496.69283l1.896464-3.883235h1.806155l0.903078-3.431696h23.118794l0.903078 3.431696h1.806155l1.986772 3.883235h-1.354617v3.431696h14.539554l0.993385 4.425082zM484.04974 625.742658l-57.526061 8.308317 41.63189 40.548196-9.843549 57.255137 51.385131-27.002028 51.385131 27.002028-9.753241-57.255137 41.63189-40.548196-57.52606-8.308317-25.73772-52.107593-25.647411 52.107593z" p-id="6586" fill="#8a8a8a"></path></svg>,
  IDPicturesFront: <svg t="1580751611051" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9047" width="200" height="150"><path d="M924.463518 179.713035 98.459964 179.713035c-19.292392 0-34.932604 15.640212-34.932604 34.932604l0 593.297584c0 19.291368 15.640212 34.930557 34.932604 34.930557l826.003554 0c19.291368 0 34.93158-15.639189 34.93158-34.930557L959.395098 214.645638C959.395098 195.353246 943.754886 179.713035 924.463518 179.713035zM542.804075 367.552144l331.934948 0 0 64.523549L542.804075 432.075693 542.804075 367.552144zM542.804075 493.02688l331.934948 0 0 64.523549L542.804075 557.550429 542.804075 493.02688zM334.969563 271.723611c91.898013 0 92.042299 70.304206 92.042299 109.872387 0 39.534412-36.799114 112.987331-92.042299 113.075335-55.184857 0.088004-92.042299-73.540923-92.042299-113.075335C242.928287 342.05647 243.101225 271.723611 334.969563 271.723611zM179.4393 552.448224c23.686469-18.326391 91.808986-48.943712 91.808986-48.943712l43.00649 81.811284 7.866155-19.846-12.150738-24.443715 24.242124-24.474414 24.240077 24.474414-12.119015 24.443715 6.556323 19.378349 44.257993-81.343633c0 0 21.702278 9.784854 44.809555 21.559015l0.030699 0 0 101.68389L145.378553 626.747417C145.378553 626.748441 155.81423 570.899458 179.4393 552.448224zM877.543905 760.120031l-732.165352 0L145.378553 695.595458l732.165352 0L877.543905 760.120031z" p-id="9048" fill="#8a8a8a"></path></svg>,
  IDPicturesReverse: <svg t="1580787458144" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1920" width="200" height="150"><path d="M999.905882 827.231373H24.094118c-13.251765 0-24.094118-10.842353-24.094118-24.094118V220.862745c0-13.251765 10.842353-24.094118 24.094118-24.094118h975.811764c13.251765 0 24.094118 10.842353 24.094118 24.094118v582.27451c0 13.251765-10.842353 24.094118-24.094118 24.094118zM266.641569 326.475294c-74.290196 0-134.324706 52.806275-134.324706 117.659608 0 30.920784 13.452549 59.833725 37.747451 81.92l-5.019608 27.507451c-0.803137 3.212549 1.003922 6.023529 3.814902 7.629804 1.807059 1.003922 3.212549 1.606275 5.019608 1.807059 1.003922 1.807059 3.212549 3.413333 5.62196 3.814902 0.803137 0 1.40549 0.401569 2.208628 0.401568 1.003922 2.610196 3.614118 4.417255 6.625882 4.818824 1.003922 0.401569 2.208627 0.401569 3.212549 0.602353v0.401568c1.40549 2.610196 4.216471 4.015686 7.42902 4.417255l16.665098 1.204706c3.212549 0.401569 6.425098-1.204706 8.031372-3.413333h2.409412c3.614118 2.208627 7.830588 2.208627 9.637647 2.208627h0.803138c1.807059 0.602353 3.814902 0.602353 6.023529 0.401569h1.003922l12.649411 1.204706h1.003922c1.40549 0 2.409412-0.401569 3.814902-0.602353 4.216471 0.401569 7.42902 0.401569 11.64549 0 1.40549 0.602353 3.212549 1.003922 4.618039 0.602353l12.649412-1.204706h0.803137c1.807059 0.401569 3.212549 0.401569 5.019608-0.401569h1.807059c2.208627 0 6.425098-0.401569 9.838431-2.208627h2.409412c1.807059 2.208627 5.019608 3.814902 8.031373 3.413333l15.86196-1.204706c2.208627 0 4.216471-1.003922 5.621961-2.208627 0.803137-0.602353 1.40549-1.606275 2.208628-2.208628 1.003922-0.401569 2.409412-0.401569 3.614117-0.602353 3.212549-0.602353 5.621961-2.610196 6.625883-4.818823 0.803137 0 1.40549-0.401569 2.208627-0.401569 2.409412-0.602353 4.618039-1.807059 5.621961-3.814902 1.40549-0.401569 3.212549-1.003922 5.019608-1.807059 2.81098-1.606275 4.216471-4.818824 3.814902-7.629803l-5.621961-27.90902c24.495686-22.086275 37.747451-50.798431 37.747451-81.92 0.401569-64.853333-59.833725-117.659608-133.923137-117.659608zM913.568627 337.317647H572.235294c-11.043137 0-20.078431 9.035294-20.078431 20.078431s9.035294 20.078431 20.078431 20.078432h341.333333c11.043137 0 20.078431-9.035294 20.078432-20.078432s-9.035294-20.078431-20.078432-20.078431z m0 148.580392H572.235294c-11.043137 0-20.078431 9.035294-20.078431 20.078432s9.035294 20.078431 20.078431 20.078431h341.333333c11.043137 0 20.078431-9.035294 20.078432-20.078431s-9.035294-20.078431-20.078432-20.078432z m0 164.643137H110.431373c-11.043137 0-20.078431 9.035294-20.078432 20.078432s9.035294 20.078431 20.078432 20.078431h803.137254c11.043137 0 20.078431-9.035294 20.078432-20.078431s-9.035294-20.078431-20.078432-20.078432z m-581.270588-124.687058c-19.275294 12.047059-42.164706 18.472157-65.857255 18.271372-23.692549 0-46.581961-6.224314-65.857255-18.271372-2.81098-1.606275-3.212549-5.019608-1.40549-7.228236 1.807059-2.208627 5.621961-2.81098 8.432941-1.204706 17.267451 10.842353 37.747451 16.464314 59.030589 16.464314 21.283137 0 41.763137-5.621961 59.030588-16.464314 2.81098-1.606275 6.425098-1.204706 8.432941 1.204706 1.807059 2.610196 1.003922 5.621961-1.807059 7.228236z m-4.618039-96.577255c-2.81098-2.610196-6.023529-4.417255-8.83451-6.224314-3.614118 1.807059-7.42902 3.212549-10.24 5.019608l3.614118-9.236079-8.031373-5.62196c3.814902-0.602353 7.42902 0 11.243922 0l5.220392-9.838432 2.81098 10.440785h11.043138l-8.83451 5.019607c0.602353 3.011765 1.40549 6.826667 2.007843 10.440785z m-38.14902 18.873725l-6.023529 8.432941-1.40549-9.838431c-2.81098-1.204706-6.625882-1.807059-10.24-2.610196l10.24-3.814902c0-3.212549-0.803137-6.224314-0.803137-9.838431l7.429019 7.027451 10.24-2.610196-5.220392 7.830588c2.409412 2.208627 4.618039 4.818824 6.625882 7.629804l-10.842353-2.208628z m-11.64549-45.17647l6.02353 16.665098-17.066667-10.440785-17.066667 10.440785 6.02353-16.665098v-0.602353l-18.472157-11.64549h21.483921l7.42902-19.275295 7.42902 19.275295h22.287058l-18.472156 11.64549 0.401568 0.602353zM244.35451 437.709804l7.429019-7.027451c0 3.212549-0.803137 6.224314-0.803137 9.838431l10.24 3.814902c-3.614118 0.602353-7.42902 1.204706-10.24 2.610196l-1.40549 9.838432-6.625882-8.432941-10.24 2.610196c2.208627-2.610196 4.618039-5.019608 6.625882-7.830589l-5.220392-7.629804 10.24 2.208628z m-20.279216-9.838431c-2.81098-1.807059-6.625882-3.212549-10.24-5.019608-2.81098 1.807059-6.023529 3.814902-8.83451 6.224313 0.803137-3.212549 1.40549-7.027451 2.208628-10.440784l-8.83451-5.019608h11.243922l2.208627-10.440784 6.023529 9.838431c3.614118 0 7.42902-0.602353 11.043138 0l-8.031373 5.621961 3.212549 9.236079z" p-id="1921" fill="#8a8a8a"></path></svg>,
  logo: <svg t="1580751969067" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12130" width="200" height="150"><path d="M558.9 409.7c-28.5 0-50.5 9.6-65.9 28.6-14.9 18.1-22.3 42.8-22.3 74 0 30.8 7.4 55.3 22.3 73.7 15.9 18.9 37.8 28.3 65.9 28.3 28.3 0 50.1-9.2 65.5-27.5 15.1-18.1 22.7-42.9 22.7-74.4 0-31.5-7.6-56.6-22.7-75.2-15.2-18.3-37-27.5-65.5-27.5z" p-id="12131" fill="#8a8a8a"></path><path d="M921.6 102.4H102.4C45.8 102.4 0 148.2 0 204.8v614.4c0 56.6 45.8 102.4 102.4 102.4h819.2c56.6 0 102.4-45.8 102.4-102.4V204.8c0-56.6-45.8-102.4-102.4-102.4zM116.5 644.8H76.3V379.2h40.2v265.6z m242.2-19.3C338.4 641.9 313.8 650 285 650c-43.4 0-76.2-13.9-98.2-41.7-19.1-23.6-28.6-55.6-28.6-96 0-39.7 9.9-71.8 29.8-96.4 22.1-28 54.3-42 96.7-42 31.3 0 56.8 8.1 76.6 24.2 19.3 15.6 31.1 37 35.3 64h-39.4c-4.5-18.1-13-31.4-25.7-39.8-12.4-8.4-28.3-12.6-47.6-12.6-28.8 0-50.4 9.8-64.7 29.4-13.6 17.6-20.5 42-20.5 73.3 0 31.8 6.7 56.4 20.1 74 14.1 18.6 36.1 27.9 65.9 27.9 19.6 0 35.7-4.8 48.4-14.5 13.4-10.4 22.7-26 27.9-46.9h39.4c-6 31-19.9 55.2-41.7 72.6zM654.5 611c-23.3 26-55.2 39.1-95.6 39.1-40.4 0-72.3-13.1-95.6-39.4-22.1-25.1-33.1-57.8-33.1-98.2 0-40.7 11-73.5 33.1-98.6 22.8-26.5 54.7-39.8 95.6-39.8 40.4 0 72.3 13.2 95.6 39.4 22.3 24.8 33.5 57.8 33.5 99 0 40.3-11.2 73.2-33.5 98.5z m293.2 33.8h-39.4L771 445h-1.5v199.8h-40.6V379.2h40.9l135.8 197.6h1.5V379.2h40.6v265.6z" p-id="12132" fill="#8a8a8a"></path></svg>
}

/**
 * @augments {React.PureComponent<{
    pictureURL?: string;
    title?: string;
    Placeholder?: string;
    hideRemark?: boolean;
    popupWidth?: number;
  }, {}>}
 */
export default class IDPictures extends React.PureComponent {
  smallImage = null;
  bigImage = null;
  lazyTimer = null;

  state = {
    visible: false,
  };

  showModelHandler = e => {
    if (e) e.stopPropagation();
    if (this.bigImage && this.smallImage)
      this.bigImage.src = this.smallImage.src;

    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { pictureURL, title, Placeholder, popupWidth, hideRemark } = this.props;

    return (
      <div className={styles.idImageWrapper}>
        <Fragment key={pictureURL} >
          <div className={styles.idImageBoxFixedWidth}
            onClick={this.showModelHandler} >
            <div className={styles.idImagePreview}>
              <Card
                hoverable
                cover={
                  <Avatar src={pictureURL} alt={title} shape="square" size='default' style={{ height: '150px' }}>
                    {imgPlaceholder[Placeholder]}
                  </Avatar>
                }
              ></Card>
            </div>
            {hideRemark ? null : (
              <div>
                <span className={styles.idImageSmall}>{title}</span>
              </div>
            )}
          </div>
          <Modal
            title={title} width={popupWidth || 720}
            onCancel={this.hideModelHandler.bind(this)}
            style={{ top: 20, textAlign: 'center' }}
            footer={null} visible={this.state.visible}>
            <img style={{ maxWidth: '100%' }}
              src={pictureURL ? pictureURL : null}
              alert={title}
            />
          </Modal>
        </Fragment>
      </div >
    );
  }
}