(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  630276,
  (e) => {
    "use strict";
    let t = (e, t, r) => Math.min(r, Math.max(t, e));
    var r = e.i(699275);
    let a = "http://www.w3.org/2000/svg",
      o = null,
      i = ["bez", "grid", "earth", "det", "cld", "tag"],
      n = (e, t) =>
        e.mp4 && e.webm
          ? !t.h264 && t.vp9
            ? e.webm
            : e.mp4
          : e.mp4
            ? t.h264
              ? e.mp4
              : void 0
            : e.webm && t.vp9
              ? e.webm
              : void 0;
    function l(e, t, r) {
      let a = t ? n(t, r) : void 0;
      return a
        ? { src: a, still: t?.still, uploaded: !0 }
        : { src: n(e, r) ?? e.mp4, still: e.still, uploaded: !1 };
    }
    let s = {
        rotary: {
          mp4: new e.U(e.r(455798)).href,
          webm: new e.U(e.r(403573)).href,
          still: new e.U(e.r(767561)).href,
        },
        tach: {
          mp4: new e.U(e.r(130093)).href,
          webm: new e.U(e.r(300427)).href,
          still: new e.U(e.r(92735)).href,
        },
      },
      c = {
        plain: new e.U(e.r(661626)).href,
        gzipped: new e.U(e.r(862932)).href,
      },
      u = 1 / 24,
      d = 1.3 + 1.6,
      f = (e, t) =>
        t > e && e >= 768
          ? Math.min(1280, e - 96)
          : e > t && t <= 540
            ? Math.min(e - 96, 1.2 * t)
            : 0;
    async function m(e, r) {
      let a,
        o = e.REDUCED,
        n = e.root,
        m = n.querySelector(".stage"),
        h = document.createElement("canvas").getContext("webgl2");
      if (!h) throw Error("cupola: WebGL2 is not available");
      h.getExtension("WEBGL_lose_context")?.loseContext();
      let p = new AbortController(),
        g = e.later(() => p.abort(), 12e3);
      e.onDestroy(() => p.abort());
      try {
        let e = "function" == typeof DecompressionStream,
          t = await fetch(e ? c.gzipped : c.plain, { signal: p.signal });
        if (!t.ok || !t.body)
          throw Error(`cupola: the dataset didn't load (${t.status})`);
        let r = e
          ? new Response(t.body.pipeThrough(new DecompressionStream("gzip")))
          : t;
        a = (function (e) {
          let t = new DataView(e);
          if (
            "LCP1" !==
            (e.byteLength >= 8
              ? new TextDecoder().decode(new Uint8Array(e, 0, 4))
              : "")
          )
            throw Error("cupola: not a packed dataset");
          let r = t.getUint32(4, !0);
          if (8 + r > e.byteLength)
            throw Error("cupola: the dataset is cut short");
          let { blobs: a, ...o } = JSON.parse(
            new TextDecoder().decode(new Uint8Array(e, 8, r)),
          );
          for (let t of i) {
            let i = a?.[t];
            if (!o[t] || !Array.isArray(i))
              throw Error(`cupola: no ${t} table`);
            let [n, l] = i;
            if (!(n >= 8 + r) || !(l >= 0) || n + l > e.byteLength)
              throw Error("cupola: the dataset is cut short");
            o[t].data = new Uint8Array(e, n, l);
          }
          let n = {
            bez: o.bez.u * o.bez.d * o.keys * 3,
            grid: o.grid.x * o.grid.y * o.keys * 3,
            earth: o.earth.a * o.earth.h * o.keys * 3,
            det: o.det.a * o.det.h,
            cld: o.cld.w * o.cld.h,
            tag: o.tag.w * o.tag.h * 4,
          };
          for (let e of i)
            if (o[e].data.length !== n[e])
              throw Error(`cupola: the ${e} table is not the size it says`);
          if (!Array.isArray(o.win) || 192 !== o.win.length)
            throw Error("cupola: the window's outline should have 96 points");
          return o;
        })(await r.arrayBuffer());
      } catch (t) {
        if (e.destroyed) return;
        throw t;
      } finally {
        clearTimeout(g);
      }
      if (e.destroyed) return;
      let x = a.limb;
      ((e.model = r.model), (e.titleMin = 51), (e.titleFit = f));
      let y = n.querySelector("#mh-ov"),
        w = e.own(document.createElement("canvas"));
      ((w.id = "mh-c2"),
        w.setAttribute("aria-hidden", "true"),
        m.insertBefore(w, y));
      let E = e.own(document.createElement("canvas"));
      ((E.id = "mh-fx"),
        E.setAttribute("aria-hidden", "true"),
        m.insertBefore(E, w));
      let b = w.getContext("2d");
      if (!b) throw Error("launch hero: no 2D canvas");
      let T = (function (e, t) {
        let r = e.getContext("webgl2", {
          alpha: !1,
          antialias: !1,
          premultipliedAlpha: !1,
        });
        if (!r) return null;
        let a = () => r.getExtension("WEBGL_lose_context")?.loseContext(),
          o = (e, t) => {
            let a = r.createShader(e);
            return a &&
              (r.shaderSource(a, t),
              r.compileShader(a),
              r.getShaderParameter(a, r.COMPILE_STATUS))
              ? a
              : null;
          },
          i = o(
            r.VERTEX_SHADER,
            "#version 300 es\nin vec2 aPos;void main(){gl_Position = vec4(aPos,0.,1.);}",
          ),
          n = o(
            r.FRAGMENT_SHADER,
            "#version 300 es\nprecision highp float;\n#define NW 96\nuniform vec2 uRes;uniform vec3 uXf,uZ;uniform vec2 uWo;uniform float uWX,uWY;uniform vec2 uFit;uniform float uDpr,uT,uDawn;uniform vec2 uMouse;uniform vec2 uWin[NW];uniform float uCum[NW + 1];uniform sampler2D tBez,tGrid,tEarth,tDet,tVidA,tVidB,tCld,tTag;uniform vec4 uTag;uniform float uVidK,uVidMix,uFlow,uAmt;uniform vec2 uTagOff,uSheen;uniform vec4 uShade;uniform vec2 uTerm;uniform float uSunG,uBlurF,uLand,uLens,uLandX;uniform float uShadeK,uWarm,uStarP,uTagA,uGlass,uRoll,uGrade,uMoon;float gLand = 0.,gCity = 0.,gCloud = 0.;vec3 gradeF(vec3 c,float ew,float gw){float l = dot(c,vec3(.2126,.7152,.0722));vec3 day = c * vec3(1.304,.84,.8)+ vec3(-.206,.095,.068);vec3 dark = vec3(c.r * .42,c.g * .98 + c.r * .06,c.b * .96);day = mix(day,c,gw);vec3 e = clamp(mix(dark,day,smoothstep(.1,.34,l)),0.,1.);c = mix(c,e,ew);float wm = smoothstep(0.,.25,clamp((c.r - c.b)/ max(c.r,.02),0.,1.))*(1. - ew);c.b *= 1. - .44 * wm;c.g *= 1. - .04 * wm;c.r *= 1. + .12 * wm * smoothstep(.1,.4,c.r);l = dot(c,vec3(.2126,.7152,.0722));c = mix(c,vec3(l)* vec3(.86,1.1,.88),(1. - smoothstep(.03,.2,l))*(1. - ew));return c;}uniform vec4 uLimb;uniform vec4 uBezR;uniform vec4 uEarthR;uniform float uDetH0,uKeys;out vec4 oc;vec3 h33(vec3 p){p = fract(p * vec3(.1031,.1030,.0973));p += dot(p,p.yxz + 33.33);return fract((p.xxy + p.yxx)* p.zyx);}float hash(vec2 p){p = fract(p * vec2(123.34,456.21));p += dot(p,p + 45.32);return fract(p.x * p.y);}vec2 win(vec2 p){float d = 1e18,s = 1.,bu = 0.;for(int i = 0,j = NW - 1;i < NW;j = i,i++){vec2 a = uWin[i],e = uWin[j]- a,w = p - a;float t = clamp(dot(w,e)/ dot(e,e),0.,1.);vec2 b = w - e * t;float dd = dot(b,b);if(dd < d){d = dd;bu = i == 0 ? mix(1.,uCum[NW - 1],t): mix(uCum[i],uCum[j],t);}bvec3 c = bvec3(p.y >= a.y,p.y < uWin[j].y,e.x * w.y > e.y * w.x);if(all(c)|| all(not(c)))s = -s;}return vec2(s * sqrt(d),bu);}float vn2(vec2 p){vec2 i = floor(p),f = fract(p);f = f * f *(3. - 2. * f);return mix(mix(hash(i),hash(i + vec2(1,0)),f.x),mix(hash(i + vec2(0,1)),hash(i + vec2(1,1)),f.x),f.y);}float fbm2(vec2 p){float a = .5,s = 0.;for(int i = 0;i < 4;i++){s += a * vn2(p);p = p * 2.07 + 5.3;a *= .5;}return s;}vec3 keyedD(sampler2D tx,vec2 uv,float rows,float dv){float k = clamp(dv,0.,1.)*(uKeys - 1.),k0 = floor(min(k,uKeys - 1.001)),f = k - k0;float v = clamp(uv.y,.5 / rows,1. - .5 / rows);vec3 a = texture(tx,vec2(uv.x,(k0 + v)/ uKeys)).rgb,b = texture(tx,vec2(uv.x,(k0 + 1. + v)/ uKeys)).rgb;return mix(a,b,smoothstep(0.,1.,f));}vec3 keyed(sampler2D tx,vec2 uv,float rows){return keyedD(tx,uv,rows,uDawn);}float hmap(float h){float s = sign(h)* sqrt(abs(h)),s0 = -sqrt(-uEarthR.z),s1 = sqrt(uEarthR.w);return(s - s0)/(s1 - s0);}vec3 earthAtD(float ang,float h,float dv){vec2 es = vec2(textureSize(tEarth,0));float ea =(ang - uEarthR.x)/(uEarthR.y - uEarthR.x);{float m =(ea - .11)/ .78;m = mod(m + 2.,2.)- 1.;m = 1. -(sqrt(m * m + .0009)- .03);ea = .11 + .78 * m;}float hv = hmap(min(h,uEarthR.w));hv = .21 + sqrt((hv - .21)*(hv - .21)+ .0001)- .01;vec3 e = keyedD(tEarth,vec2(ea,hv),es.y / uKeys,dv);if(h < -2.){float dv = sqrt(-h)/ sqrt(-uDetH0);float det =(texture(tDet,vec2(ea,clamp(dv,0.,1.))).r * 255. - 128.)/ 2. / 255.;float bright = clamp(dv * 2. - 1.,0.,1.);e += vec3(.92,.95,1.)* det * bright * smoothstep(-3.,-12.,h)*(1. - smoothstep(.97,1.,dv));}return e;}vec3 earthAt(float ang,float h){return earthAtD(ang,h,uDawn);}float mirr(float x,float lo,float hi){float w = hi - lo,m = mod(x - lo,2. * w);return lo +(m < w ? m : 2. * w - m);}vec3 vidAt(float a,float h){a = mirr(a,-.22,.22);h = h < 0. ? -mirr(-h,0.,300.): min(h,60.);vec2 u =(uLimb.xy +(uLimb.z + h)* vec2(sin(a),-cos(a)))/ vec2(1920.,1080.);return mix(texture(tVidB,u).rgb,texture(tVidA,u).rgb,uVidMix);}vec2 h22(vec2 p){vec3 a = fract(p.xyx * vec3(.1031,.1030,.0973));a += dot(a,a.yzx + 33.33);return fract((a.xx + a.yz)* a.zy);}vec2 wr(vec2 i){return mod(i,211.);}float vn2g(vec2 p){vec2 i = floor(p),f = fract(p);f = f * f *(3. - 2. * f);return mix(mix(hash(wr(i)),hash(wr(i + vec2(1,0))),f.x),mix(hash(wr(i + vec2(0,1))),hash(wr(i + vec2(1,1))),f.x),f.y);}float fbmg(vec2 p){float a = .5,s = 0.;for(int i = 0;i < 4;i++){s += a * vn2g(p);p = mat2(1.6,1.2,-1.2,1.6)* p + 7.3;a *= .5;}return s;}float worley(vec2 p){vec2 i = floor(p),f = fract(p);float d = 1.;for(int y = -1;y <= 1;y++)for(int x = -1;x <= 1;x++){vec2 o = vec2(x,y),r = o + h22(wr(i + o))- f;d = min(d,dot(r,r));}return sqrt(d);}float cloudF(vec2 g,float T,float k){vec2 w = vec2(fbmg(g * .045 + vec2(0.,T * .003)),fbmg(g * .045 + vec2(5.2,1.3)- T * .003))- .5;vec2 gs =(g + w * 7.)* vec2(1.,1.25);float big = fbmg(gs * .085),mid = fbmg(gs * .3 + 3.1);float base = big * .62 + mid * .38;float c1 = 1. - worley(gs * .9),c2 = 1. - worley(gs * 2.3 + 7.1);float fwg = length(fwidth(gs)),kf = 1. - smoothstep(.08,.35,fwg);float film = texture(tCld,gs * .21 + vec2(.13,.41)).r;float ero =(fbmg(gs * 4.3 + 17.)- .5)* .16 * k +(fbmg(gs * 1.4 + 9.)- .5)* .1;float det =((c1 * .6 + c2 * .4)- .45)* .42 * k +(film - .5)* .16 * kf + ero;float kb = 1. - smoothstep(.35,1.4,fwg * .085 * 10.);return mix(.5,base,kb)+ det * kb;}vec3 genEarth(float a,float h,float T){float d = max(-h,0.)+ 4.,Z = 900. / d,X = a * Z * 4.2;vec2 g = vec2(X,Z)+ vec2(-T * 2.37,T * 2.85);float fw = length(fwidth(g)),k = 1. - smoothstep(.03,.2,fw);float regn = fbmg(g * .04 + vec2(11.3,3.7)+ T * .004);float bald = smoothstep(.66,.76,fbmg(g * .1 + vec2(37.1,5.9)));float th = mix(.72,.3,uAmt)+(regn - .5)* .45 + bald * .5;float c = cloudF(g,T,k);float c2 = cloudF(g + vec2(-.1,-.15)*(.4 + 2. * fw),T,k);float fa = 1. - exp(-38. / d),fb = pow(1. - exp(-60. / d),1.5);vec3 sea = mix(vec3(.1,.38,.6),vec3(.13,.43,.64),vn2g(g * .05)* .6);sea = mix(sea,vec3(.36,.55,.71),fa * .7);float lnD = fbmg(g * .011 + vec2(71.3,19.7))+(fbmg(g * .07 + 3.3)- .5)* .22 +(fbmg(g * .45 + 8.1)- .5)* .09 * k;float LT = .56 - uLandX;float laa = max(fwidth(lnD),.003),land = smoothstep(LT - laa,LT + laa,lnD)* uLand;float shelf = smoothstep(LT - .05,LT,lnD)*(1. - land)* uLand;float moist = fbmg(g * .05 + 51.),mot = fbmg(g * .18 + 29.),k1 = 1. - smoothstep(.1,.8,fw * .35);float rid = pow(1. - abs(fbmg(g * .33 + 13.)* 2. - 1.),6.)* k1;vec3 lc = mix(vec3(.4,.38,.3),vec3(.27,.32,.25),smoothstep(.35,.65,moist));lc *= .82 + .22 * mot;lc = mix(lc,vec3(.22,.22,.19),rid * .45);lc = mix(lc,vec3(.36,.55,.71),.18 + fa * .72);sea = mix(sea,mix(vec3(.2,.55,.63),sea,fa * .85),shelf * .55);sea = mix(sea,lc,land);{float coast = 1. - smoothstep(LT,LT + .1,lnD);float cd = smoothstep(.5,.75,fbmg(g * .09 + 91.))*(.3 + .7 * coast);vec2 cg = g * 3.2,ci = floor(cg),cf = fract(cg);vec3 hr = h33(vec3(wr(ci),5.1));float dd = length(cf -(.2 + .6 * hr.yz)),pt = hr.x < cd * .9 ? exp(-dd * dd / .018)*(.5 + hr.y): 0.;float kc = 1. - smoothstep(.15,.6,fw * 3.2);gCity = land * mix(cd * .22,pt + cd * .07,kc)*(1. - fb * .7);gLand = land;}float edge = smoothstep(th - .02 - fa * .05,th + .03 + fa * .07,c),body = smoothstep(th + .01,th + .16,c);gCloud = edge;float thin = smoothstep(th - .1,th - .01,c)*(1. - edge)* k;float lit = clamp(.5 +(c - c2)* 6.,0.,1.);vec3 col = sea *(1. -(.12 * smoothstep(th - .04,th + .06,c2)+ .14 * smoothstep(th + .06,th + .24,c2))*(1. - edge)*(1. - fa * .6));col = mix(col,vec3(.4,.56,.7),thin * .5);float crev = smoothstep(.35,.75,fbmg(g * 2.6 + 23.))* k,tex = fbmg(g * 6.5 + 41.);vec3 shade = vec3(.38,.52,.66),topc = mix(vec3(.64,.69,.76),vec3(.82,.84,.87),lit)*(.93 + .1 * tex * k);vec3 cw = mix(shade,topc,clamp(.35 + .45 * lit + .5 * body - .45 * crev *(1. - body * .4),0.,1.));cw = mix(cw,vec3(.62,.69,.78),fa * .5);col = mix(col,cw,edge * mix(.96,.85,fa));col = mix(col,vec3(.65,.72,.81),fb * .85);return col;}void main(){vec2 Pc = vec2(gl_FragCoord.x,uRes.y - gl_FragCoord.y)/ uDpr;vec2 q =(Pc - uXf.yz)/ uXf.x;vec2 par =(uMouse - .5)* vec2(-7.,-4.);vec2 d0 =(q - uZ.yz)/ uZ.x;float cr = cos(uRoll),sr = sin(uRoll);d0 = mat2(cr,sr,-sr,cr)* d0;vec2 qw0 = uZ.yz + d0 - uWo;float up = 500. - qw0.y,yw = uWY <= 0. || up <= 0. ? qw0.y : up <= 198. + uWY ? 500. - up * 198. /(198. + uWY): qw0.y + uWY;float dx = qw0.x - 962.,ex = abs(dx),xw;if(uFit.x > 0.){float src = 676.3 - .5437 *(clamp(yw,302.,790.)- 302.);float want = mix(uFit.x,uFit.y,clamp((qw0.y -(302. - uWY))/(488. + uWY),0.,1.));xw = ex <= want ? ex * src / want : ex + src - want;}else{float sh = max(0.,uWX - .205 * max(0.,800. - yw));xw = ex <= 2. * sh ? ex * .5 : ex - sh;}vec2 qw = vec2(962. + sign(dx)* xw,yw);vec2 gs = vec2(textureSize(tGrid,0));float gRows = gs.y / uKeys;vec3 col = keyed(tGrid,qw / vec2(1920.,1080.),gRows);vec2 wu = win(qw);float sd = wu.x,u = wu.y;vec2 qe = q + par;vec2 dq = qe - uLimb.xy;float h = length(dq)- uLimb.z,ang = atan(dq.x,-dq.y);float inside = 1. - smoothstep(-6.,-2.,sd),ew = 0.,gw = 0.;vec3 cityAdd = vec3(0.);if(inside > 0.){float wE = 1. - smoothstep(uEarthR.w - 30.,uEarthR.w,h);vec3 sky = col;float st = 0.;for(int k = 0;k < 2;k++){float cs = k == 0 ? 7. : 13.;vec2 qs = q + par * uStarP;vec2 g = qs / cs,c0 = floor(g),f = fract(g);vec3 r = h33(vec3(c0,float(k)* 17.3));float dens = smoothstep(.25,.85,h33(vec3(floor(qs / 260.),3.1)).x * .6 + h33(vec3(floor(qs / 90.),9.7)).y * .4);if(r.x >(k == 0 ? .972 - .02 * dens : .93)){vec2 p = vec2(.15)+ .7 * r.yz;float d = length((f - p)* cs);float sz = mix(.7,1.6,pow(fract(r.x * 91.7),3.)),br = mix(.45,1.5,pow(fract(r.y * 53.1),2.))*(k == 0 ? .85 : 1.);st += br * exp(-d * d /(sz * sz))*(.85 + .15 * sin(uT *(1.3 + r.z * 2.)+ r.x * 40.));}}st *= smoothstep(8.,70.,h)*(1. - .7 * uDawn);sky += vec3(.8,.85,1.)* min(st,1.4)* .75;vec3 e = earthAt(ang,h);vec3 inner = mix(sky,e,wE);if(h < 6.){vec3 ge = uBlurF > .006 ?(genEarth(ang,h,uFlow)+ genEarth(ang,h,uFlow - uBlurF * .5)+ genEarth(ang,h,uFlow - uBlurF))/ 3. : genEarth(ang,h,uFlow);float s = sqrt(max(-h,0.)/ 360.)+ ang * .3,tw = .6;float lit = uTerm.y > .5 ? smoothstep(uTerm.x - tw,uTerm.x + tw,s): 1. - smoothstep(uTerm.x - tw,uTerm.x + tw,s);lit = lit * lit *(3. - 2. * lit);lit = mix(uSunG,lit,.45);float em = 1. - smoothstep(-2.,6.,h);vec3 nt = earthAtD(ang,h,0.);vec3 dayc = ge * mix(.45,1.,lit);float tb = lit *(1. - lit)* 4.,cl = smoothstep(.45,.9,dot(ge,vec3(.3,.5,.2)));dayc = mix(dayc,dayc * vec3(1.18,.9,.76),tb * .4)+ vec3(1.,.55,.3)* tb * cl * .05;inner = mix(inner,mix(nt,dayc,lit),em);gw = lit * em;cityAdd = vec3(1.,.7,.38)* gCity *(1. - lit)* em *(1. - gCloud * .85)* 1.1 * uLand;if(uMoon > .001 && lit < .999)inner += vec3(.3,.4,.62)* cl * .2 * uMoon *(1. - lit)* smoothstep(-3.,-45.,h);}ew = inside *(1. - smoothstep(-2.,6.,h));inner *= 1. + .03 * sin(uT * .9)* exp(-abs(h)/ 6.);if(uLens > .001){float dk = smoothstep(.3,.9,uDawn),li = dot(inner,vec3(.3,.55,.15));inner += vec3(.45,.62,.9)* exp(-abs(h)/ 30.)* .05 * uLens *(.3 + .7 * dk);vec2 qg = qe + vec2(-5.,-15.)+ uSheen * vec2(7.,12.);float hg = length(qg - uLimb.xy)- uLimb.z;inner += vec3(.5,.66,.95)* exp(-abs(hg - 1.)/ 3.)* .045 * uLens *(.35 + .65 * dk)*(1. - smoothstep(.1,.45,li));float dust = 0.;for(int j = 0;j < 2;j++){float cs2 = j == 0 ? 74. : 31.;vec2 dc = qw0 / cs2 + float(j)* 7.3,di = floor(dc),df = fract(dc);vec3 dr = h33(vec3(di,13.7 + float(j)));if(dr.x >(j == 0 ? .8 : .9)){float rad = mix(.06,.17,dr.y),dd = length(df -(.25 + .5 * dr.yz));dust +=(smoothstep(rad,rad * .35,dd)* .8 + smoothstep(rad * .12,0.,abs(dd - rad * .8))* .25)* mix(.35,1.,dr.z)*(j == 0 ? 1. : .6);}}inner += vec3(.8,.85,.92)* dust * .03 * uLens *(.35 + .65 *(1. - li));inner *= 1. - dust * .06 * uLens * li;}if(uWarm > .001){float side = .55 + .45 * clamp(-ang / .3,-1.,1.),hw = h + 2.5;float band = exp(-hw * hw /(hw > 0. ? 5. : 22.));float lumA = dot(inner,vec3(.3,.55,.15)),ride = .2 + .8 * smoothstep(.04,.35,lumA);float k = uWarm * side * band * .6;inner = mix(inner,inner * vec3(1.45,.86,.58),k * .7);inner += vec3(1.,.52,.2)* k * ride * .28;inner = mix(inner,inner * vec3(1.08,.95,.86),uWarm * .35 *(1. - smoothstep(-8.,0.,h)));}if(uShadeK > .001 && h < 8.){float dy = Pc.y - uShade.y,rx = uShade.z *(1. + max(dy,0.)/ 900.),dxn =(Pc.x - uShade.x)/ rx;float fe = smoothstep(-50.,70.,dy)* exp(-dxn * dxn * 1.3)* uShadeK;float lum = dot(inner,vec3(.3,.55,.15));vec3 calm = mix(inner,vec3(lum)* vec3(.55,.66,1.),.45);calm = vec3(.035,.055,.16)+ calm * .42;float below = 1. - smoothstep(-10.,4.,h);inner = mix(inner,calm,fe * .85 * below);inner *= 1. - .32 * uShadeK * smoothstep(-20.,-420.,h);}if(uGlass > .001){vec2 rc = vec2(mirr(1920. - qw0.x + uSheen.x * 140.,320.,1600.),1045. -(qw0.y - 280.)* .3 + uSheen.y * 60.);vec3 rf = vec3(0.);for(int i = 0;i < 8;i++){float fi = float(i),an = fi * 2.39996 + .7,rr = sqrt((fi + .5)/ 8.)* 20.;rf += keyed(tGrid,(rc + vec2(cos(an),sin(an))* rr)/ vec2(1920.,1080.),gRows);}rf /= 8.;rf = mix(vec3(dot(rf,vec3(.3,.55,.15))),rf,.75);rf = max(rf - vec3(.035),0.);float lumI = dot(inner,vec3(.3,.55,.15)),vis = 1. - smoothstep(.08,.45,lumI);float edge =(.55 + .45 * smoothstep(-160.,-8.,sd))*(1. - .7 * smoothstep(380.,820.,abs(qw0.x - 962.)));float broad = .5 + .5 * smoothstep(-.6,.6,((qw0.x - 962.)/ 900. + uSheen.x * .35)* .7 +((qw0.y - 540.)/ 500.)* .5);inner += rf * uGlass * 15. * vis * edge * broad;}inner *= 1. - .42 *(1. - smoothstep(-70.,-3.,sd))*(.6 + .4 * smoothstep(-70.,-3.,sd));col = mix(col,inner,inside);}float wB = smoothstep(uBezR.z,uBezR.z + 4.,sd)*(1. - smoothstep(uBezR.w - 24.,uBezR.w,sd))*(1. - inside *(1. - smoothstep(-8.,-2.,sd)));if(wB > 0.){vec2 bs = vec2(textureSize(tBez,0));vec3 bz = keyed(tBez,vec2(u,(sd - uBezR.z)/(uBezR.w - uBezR.z)),bs.y / uKeys);col = mix(col,bz,wB);}if(uTagA > .001){vec2 qt = qw0 - uTagOff;const float R = 9.;vec2 tu0 =(qt - uTag.xy)/ uTag.zw,pad = vec2(R)/ uTag.zw;if(tu0.x > -pad.x && tu0.x < 1. + pad.x && tu0.y > -pad.y && tu0.y < 1. + pad.y){vec3 acc = vec3(0.);float aa = 0.;for(int i = 0;i < 16;i++){float fi = float(i),an = fi * 2.39996,rr = sqrt((fi + .5)/ 16.)* R;vec2 u =(qt + vec2(cos(an),sin(an))* rr - uTag.xy)/ uTag.zw;float ins = step(0.,u.x)* step(u.x,1.)* step(0.,u.y)* step(u.y,1.);vec4 tg = texture(tTag,clamp(u,0.,1.))* ins;acc += tg.rgb * tg.a;aa += tg.a;}float a = aa / 16.;vec3 tc = aa > 0. ? acc / aa : vec3(0.);float lit = mix(.2,1.,smoothstep(.3,.9,uDawn));tc = tc * lit * .92 + vec3(1.,.5,.2)* uWarm * .06;col = mix(col,tc,a * .96 * uTagA);}}{float dayK = smoothstep(.4,.95,uDawn),lip = exp(-max(sd,0.)/ 14.)*(1. - inside);col += vec3(.3,.44,.62)* lip * .1 *(.25 + .75 * dayK);col = mix(col,col * .7,smoothstep(0.,3.,sd)*(1. - smoothstep(3.,22.,sd))* .5);}col *= mix(1.,mix(.6,1.,smoothstep(.36,.95,uDawn)),1. - inside);if(uGrade > .001)col = mix(col,gradeF(col,ew,gw),uGrade);{float nk = 1. - smoothstep(.36,.9,uDawn),ln = dot(col,vec3(.2126,.7152,.0722));float ds = nk * mix(mix(.22,.38,inside),.55,ew *(1. - gw));col = mix(col,vec3(ln)* vec3(.97,1.,1.04),ds);}col += cityAdd * inside;{vec2 uvn = gl_FragCoord.xy / uRes;col *= 1. - .22 * uLens * smoothstep(.38,.9,length((uvn - .5)* vec2(1.2,1.)));}col +=(hash(gl_FragCoord.xy + fract(uT)* 91.)- .5)/ 90.;oc = vec4(clamp(col,0.,1.),1.);}",
          ),
          l = i && n ? r.createProgram() : null;
        if (
          (l && (r.attachShader(l, i), r.attachShader(l, n), r.linkProgram(l)),
          !l || !r.getProgramParameter(l, r.LINK_STATUS))
        )
          return (a(), null);
        r.useProgram(l);
        let s = r.createBuffer();
        (r.bindBuffer(r.ARRAY_BUFFER, s),
          r.bufferData(
            r.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            r.STATIC_DRAW,
          ));
        let c = r.getAttribLocation(l, "aPos");
        (r.enableVertexAttribArray(c),
          r.vertexAttribPointer(c, 2, r.FLOAT, !1, 0, 0));
        let u = (e) => r.getUniformLocation(l, e),
          d = (e, t, a, o, i, n) => {
            let l = r.createTexture();
            return (
              r.activeTexture(r.TEXTURE0 + e),
              r.bindTexture(r.TEXTURE_2D, l),
              r.pixelStorei(r.UNPACK_ALIGNMENT, 1),
              r.texImage2D(
                r.TEXTURE_2D,
                0,
                "r" === i ? r.R8 : r.RGB8,
                t,
                a,
                0,
                "r" === i ? r.RED : r.RGB,
                r.UNSIGNED_BYTE,
                o,
              ),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR),
              r.texParameteri(
                r.TEXTURE_2D,
                r.TEXTURE_WRAP_S,
                n || r.CLAMP_TO_EDGE,
              ),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE),
              l
            );
          },
          f = t.keys;
        (d(0, t.bez.u, t.bez.d * f, t.bez.data),
          d(1, t.grid.x, t.grid.y * f, t.grid.data),
          d(2, t.earth.a, t.earth.h * f, t.earth.data),
          d(3, t.det.a, t.det.h, t.det.data, "r", r.MIRRORED_REPEAT),
          d(6, t.cld.w, t.cld.h, t.cld.data, "r", r.MIRRORED_REPEAT),
          r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.MIRRORED_REPEAT),
          r.generateMipmap(r.TEXTURE_2D),
          r.texParameteri(
            r.TEXTURE_2D,
            r.TEXTURE_MIN_FILTER,
            r.LINEAR_MIPMAP_LINEAR,
          ),
          r.uniform1i(u("tBez"), 0),
          r.uniform1i(u("tGrid"), 1),
          r.uniform1i(u("tEarth"), 2),
          r.uniform1i(u("tDet"), 3),
          r.uniform1i(u("tCld"), 6),
          r.activeTexture(r.TEXTURE7),
          r.bindTexture(r.TEXTURE_2D, r.createTexture()),
          r.pixelStorei(r.UNPACK_ALIGNMENT, 1),
          r.texImage2D(
            r.TEXTURE_2D,
            0,
            r.RGBA8,
            t.tag.w,
            t.tag.h,
            0,
            r.RGBA,
            r.UNSIGNED_BYTE,
            t.tag.data,
          ),
          r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR),
          r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR),
          r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE),
          r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE),
          r.uniform1i(u("tTag"), 7),
          r.uniform4f(u("uTag"), t.tag.x, t.tag.y, t.tag.w, t.tag.h));
        let m = t.win,
          h = m.length / 2,
          p = [0];
        for (let e = 1; e <= h; e++) {
          let t = (e - 1) * 2,
            r = (e % h) * 2;
          p.push(p[e - 1] + Math.hypot(m[r] - m[t], m[r + 1] - m[t + 1]));
        }
        (r.uniform2fv(u("uWin"), new Float32Array(m)),
          r.uniform1fv(u("uCum"), new Float32Array(p.map((e) => e / p[h]))),
          r.uniform4f(u("uLimb"), t.limb[0], t.limb[1], t.limb[2], 0),
          r.uniform4f(u("uBezR"), 0, 0, t.bez.d0, t.bez.d1),
          r.uniform4f(
            u("uEarthR"),
            t.earth.a0,
            t.earth.a1,
            t.earth.h0,
            t.earth.h1,
          ),
          r.uniform1f(u("uDetH0"), t.det.h0),
          r.uniform1f(u("uKeys"), f),
          [4, 5].forEach((e) => {
            (r.activeTexture(r.TEXTURE0 + e),
              r.bindTexture(r.TEXTURE_2D, r.createTexture()),
              r.texImage2D(
                r.TEXTURE_2D,
                0,
                r.RGB8,
                1,
                1,
                0,
                r.RGB,
                r.UNSIGNED_BYTE,
                new Uint8Array(3),
              ),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE),
              r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE));
          }),
          r.uniform1i(u("tVidA"), 4),
          r.uniform1i(u("tVidB"), 5));
        let g = {};
        for (let [e, t] of Object.entries({
          to: "uTagOff",
          sh: "uSheen",
          sd: "uShade",
          sk: "uShadeK",
          wm: "uWarm",
          sp: "uStarP",
          ta: "uTagA",
          gs: "uGlass",
          rl: "uRoll",
          gr: "uGrade",
          tm: "uTerm",
          sg: "uSunG",
          bf: "uBlurF",
          ld: "uLand",
          ls: "uLens",
          lx: "uLandX",
          mn: "uMoon",
          wx: "uWX",
          wy: "uWY",
          fit: "uFit",
          am: "uAmt",
          fl: "uFlow",
          vk: "uVidK",
          vm: "uVidMix",
          res: "uRes",
          xf: "uXf",
          z: "uZ",
          wo: "uWo",
          dpr: "uDpr",
          t: "uT",
          dawn: "uDawn",
          mouse: "uMouse",
        }))
          g[e] = u(t);
        let x = !1;
        return {
          render(t) {
            if (x || r.isContextLost()) return;
            let a = t.dpr || 1,
              o = Math.round(t.W * a),
              i = Math.round(t.Hh * a);
            ((e.width !== o || e.height !== i) &&
              ((e.width = o), (e.height = i)),
              r.viewport(0, 0, o, i),
              r.useProgram(l),
              r.uniform2f(g.res, o, i),
              r.uniform3f(g.xf, t.xf.s, t.xf.ox, t.xf.oy));
            let n = t.zoom || [1, 960, 540];
            r.uniform3f(g.z, n[0], n[1], n[2]);
            let s = t.lean || [0, 0];
            (r.uniform2f(g.wo, s[0], s[1]),
              r.uniform1f(g.dpr, a),
              r.uniform1f(g.wx, t.winX || 0),
              r.uniform1f(g.wy, t.winUp || 0),
              r.uniform2f(
                g.fit,
                t.winFit ? t.winFit[0] : 0,
                t.winFit ? t.winFit[1] : 0,
              ),
              r.uniform1f(g.t, t.t || 0),
              r.uniform1f(g.dawn, null == t.dawn ? 1 : t.dawn),
              r.uniform2f(
                g.mouse,
                null == t.mx ? 0.5 : t.mx,
                null == t.my ? 0.5 : t.my,
              ),
              r.uniform1f(g.vk, 0),
              r.uniform2f(g.to, 0, 0));
            let c = t.sheen || [0, 0];
            r.uniform2f(g.sh, c[0], c[1]);
            let u = t.shade || [0, 0, 1, 1, 0];
            (r.uniform4f(g.sd, u[0], u[1], u[2], u[3]),
              r.uniform1f(g.sk, u[4]),
              r.uniform1f(g.wm, t.warm || 0),
              r.uniform1f(g.sp, null == t.starP ? 1 : t.starP),
              r.uniform1f(g.ta, null == t.tag ? 1 : t.tag),
              r.uniform1f(g.gs, t.glass || 0),
              r.uniform1f(g.rl, t.roll || 0),
              r.uniform1f(g.gr, t.grade || 0));
            let d = t.term || [-1, 0];
            (r.uniform2f(g.tm, d[0], d[1]),
              r.uniform1f(g.sg, null == t.sunG ? 1 : t.sunG),
              r.uniform1f(g.bf, t.blur || 0),
              r.uniform1f(g.ld, null == t.land ? 1 : t.land),
              r.uniform1f(g.ls, null == t.lens ? 1 : t.lens),
              r.uniform1f(g.lx, t.landX || 0),
              r.uniform1f(g.mn, t.moon || 0),
              r.uniform1f(g.fl, t.flow || 0),
              r.uniform1f(g.am, null == t.amt ? 0.5 : t.amt),
              r.uniform1f(g.vm, 1),
              r.drawArrays(r.TRIANGLES, 0, 3));
          },
          dispose() {
            x || ((x = !0), a());
          },
        };
      })(E, a);
      if (!T) throw Error("cupola: WebGL2 is not available");
      (e.onDestroy(() => T.dispose()),
        Object.defineProperty(e, "apex", {
          configurable: !0,
          get: () =>
            innerHeight > innerWidth
              ? 0.515
              : 0.53 - (innerWidth < 768 ? 24 / Math.max(1, innerHeight) : 0),
          set() {},
        }));
      let R = !o && !((r.startAt ?? 0) >= 4),
        A = (t, r, a = 0) => {
          let o = new Image();
          o.decoding = "async";
          let i = document.createElement("video");
          ((i.muted = !0),
            (i.playsInline = !0),
            i.setAttribute("playsinline", ""),
            (i.preload = "auto"),
            (i.loop = !1));
          let n = {
              h264: !!i.canPlayType('video/mp4; codecs="avc1.64002A"'),
              vp9: !!i.canPlayType('video/webm; codecs="vp9"'),
            },
            s = () => {
              e.dirty = !0;
            },
            c = (e) => {
              for (let t of [i, o])
                e.uploaded
                  ? (t.crossOrigin = "anonymous")
                  : t.removeAttribute("crossorigin");
              (e.still ? (o.src = e.still) : o.removeAttribute("src"),
                (i.src = e.src));
            },
            u = () => {
              (i.removeEventListener("error", u),
                e.destroyed || c(l(t, null, n)));
            },
            d = () => {
              a &&
                Number.isFinite(i.duration) &&
                (i.currentTime = i.duration * a);
            };
          if (
            (i.addEventListener("loadeddata", s),
            i.addEventListener("seeked", s),
            i.addEventListener("loadedmetadata", d),
            o.addEventListener("load", s),
            R)
          ) {
            let e = l(t, r, n);
            (e.uploaded && i.addEventListener("error", u), c(e));
          }
          return (
            e.onDestroy(() => {
              (i.removeEventListener("loadeddata", s),
                i.removeEventListener("seeked", s),
                i.removeEventListener("loadedmetadata", d),
                o.removeEventListener("load", s),
                i.removeEventListener("error", u),
                o.removeAttribute("src"),
                R && (i.pause(), i.removeAttribute("src"), i.load()));
            }),
            {
              v: i,
              still: o,
              play() {
                let e = i.play();
                e && e.catch && e.catch(() => {});
              },
            }
          );
        },
        L = [
          {
            v: A(s.rotary, r.clips?.[0]),
            A: [972, 1664, 1510],
            VW: 1920,
            VH: 1012,
            d: 2,
            rate: 1,
            col: [76, 29, 20],
            keep: [330, 780, 1560],
          },
          {
            v: A(s.tach, r.clips?.[1], 0.5),
            A: [959.6, 1070.8, 677.4],
            VW: 1920,
            VH: 1012,
            d: 2,
            rate: 1,
            top: !0,
            from: 0.5,
            col: [18, 18, 18],
            keep: [520, 830, 1320],
          },
        ],
        M = [578, 830, 1264];
      ((e.arcCap = (t, r) =>
        r > t
          ? Math.max(
              Math.min(
                ...L.map((e) => {
                  let a = e.top && r > t ? M : e.keep;
                  return (
                    (e.A[2] * (t / 2 - 14)) /
                    Math.max(e.A[0] - a[0], a[2] - e.A[0])
                  );
                }),
              ),
              1.01 * t * Math.max(...L.map((e) => e.A[2] / e.VW), x[2] / 1920),
              1.55 * t,
            )
          : x[2] *
            Math.max(
              (t / 1920) * 1.01,
              ((r * e.apex) / (x[1] - x[2])) * 1.01,
              ((r - e.apex * r) / (1080 - (x[1] - x[2]))) * 1.01,
            )),
        (L[0].rate = 2));
      let D = L.reduce((e, t) => e + t.d, 0),
        S = document.createElement("canvas");
      ((S.width = 32), (S.height = 2));
      let _ = S.getContext("2d", { willReadFrequently: !0 }),
        k = (e, t) => {
          let r = (e.v.v.videoWidth || e.VW) / e.VW;
          _.drawImage(
            e.v.v,
            0.3 * e.VW * r,
            t * r,
            0.4 * e.VW * r,
            12 * r,
            0,
            0,
            32,
            2,
          );
          let a = _.getImageData(0, 0, 32, 2).data,
            o = 0,
            i = 0,
            n = 0;
          for (let e = 0; e < a.length; e += 4)
            ((o += a[e]), (i += a[e + 1]), (n += a[e + 2]));
          let l = a.length / 4;
          return {
            rgb: [(o / l) | 0, (i / l) | 0, (n / l) | 0],
            sum: o + i + n,
            n: l,
          };
        },
        P = -1,
        F = (e = !1) => {
          R &&
            L.forEach((t, r) => {
              let a = t.v.v;
              if (r && r !== P && (e ? r > P : a.readyState < 2))
                try {
                  let e = a.play();
                  e &&
                    e.then &&
                    e
                      .then(() => {
                        P !== r && a.pause();
                      })
                      .catch(() => {});
                } catch {}
            });
        },
        q = (t, r, a, o) => {
          (t.addEventListener(r, a, o),
            e.onDestroy(() => t.removeEventListener(r, a, o)));
        },
        z = () => F();
      (q(window, "touchstart", z, { once: !0, passive: !0 }),
        q(window, "pointerdown", z, { once: !0, passive: !0 }));
      let C = () => {
        let t = L[P];
        R &&
          !ed &&
          t &&
          t.v.v.paused &&
          (t.v.play(), F(!0), (P = -1), (e.dirty = !0));
      };
      for (let e of ["touchend", "pointerup", "click", "keydown"])
        q(window, e, C, { passive: !0 });
      let U = (e, r, a) => {
          let o = t((a - e) / (r - e), 0, 1);
          return o * o * (3 - 2 * o);
        },
        W = (e) => 1 - Math.pow(1 - t(e, 0, 1), 3),
        B = (e) => 0.5 - 0.5 * Math.cos(Math.PI * t(e, 0, 1));
      e.onDestroy(() => n.style.removeProperty("--toc-below"));
      let X = 0,
        G = -1,
        I = e.own(document.createElement("div"));
      ((I.className = "veil"), m.appendChild(I));
      let N = n.querySelector(".skipbtn:not(.scrollcue)"),
        $ = n.querySelector(".scrollcue"),
        V = (t) => {
          (t.stopPropagation(), (G = performance.now()), (e.dirty = !0));
        },
        H = (e) => {
          (e.stopPropagation(),
            scrollTo({
              top: n.getBoundingClientRect().bottom + scrollY,
              behavior: o ? "auto" : "smooth",
            }));
        };
      (N?.addEventListener("click", V),
        $?.addEventListener("click", H),
        q(window, "scroll", () => $?.classList.toggle("off", scrollY > 24), {
          passive: !0,
        }));
      let O = (e, t, r) => {
          e && e.classList.contains(t) !== r && e.classList.toggle(t, r);
        },
        K = (e, t) => {
          e && e.disabled === t && (e.disabled = !t);
        };
      e.onDestroy(() => {
        for (let e of (N?.removeEventListener("click", V),
        $?.removeEventListener("click", H),
        [N, $]))
          e && (e.classList.remove("gone", "on", "off"), (e.disabled = !1));
      });
      let Q = !1;
      e.away = () => {
        Q = !0;
      };
      let j = { x: 0.5, y: 0.5 },
        Y = { x: 0.5, y: 0.5 },
        Z = null,
        J = () => {
          j.x = j.y = 0.5;
        };
      (q(window, "blur", J),
        q(document, "visibilitychange", () => {
          (document.hidden && J(), (Z = null));
        }),
        q(document, "pointerout", (e) => {
          e.relatedTarget || J();
        }));
      let ee = (e) => {
        "touch" === e.pointerType && J();
      };
      (q(window, "pointerup", ee),
        q(window, "pointercancel", ee),
        q(
          window,
          "pointermove",
          (e) => {
            if (
              e.target instanceof Element &&
              e.target.closest(".skipbtn, header")
            )
              return;
            let r = m.getBoundingClientRect();
            ((j.x = t((e.clientX - r.left) / r.width, 0, 1)),
              (j.y = t((e.clientY - r.top) / r.height, 0, 1)));
          },
          { passive: !0 },
        ));
      let et = n.querySelector("#mh-title-g"),
        er = n.querySelector(".landing"),
        ea = er?.querySelector(".eyebrow"),
        eo = er ? [...er.querySelectorAll(".toc li")] : [];
      e.onDestroy(() => {
        for (let e of [ea, ...eo]) e?.style.removeProperty("opacity");
      });
      let ei = new Map(),
        en = (e, t, r) => {
          if (!e) return;
          let a = ei.get(e) ?? {};
          a[t] !== r &&
            (ei.set(e, { ...a, [t]: r }), e.style.setProperty(t, r));
        },
        el = (r, a) => {
          let o = (e, a) => t((r - e) / (a - e), 0, 1);
          e.G = a;
          let i = o(0.6, 1);
          (e.landing(a),
            en(er, "opacity", i > 0.001 ? "1" : "0"),
            en(er, "visibility", i > 0.001 ? "visible" : "hidden"),
            en(ea, "opacity", B(i / 0.45).toFixed(3)),
            eo.forEach((e, t) =>
              en(e, "opacity", B((i - 0.2 - 0.12 * t) / 0.45).toFixed(3)),
            ));
          let n = o(0.2, 0.72),
            l = 1 - 0.02 * Math.pow(1 - o(0.2, 1), 2.2);
          return (
            en(et, "opacity", B(n).toFixed(3)),
            en(et, "transform", l < 0.9999 ? `scale(${l.toFixed(5)})` : "none"),
            n
          );
        },
        es = null,
        ec = null,
        eu = null,
        ed = o || !!r.still,
        ef = o ? D + 4.5 + 9 : Math.max(0, r.startAt ?? 0),
        em = 0,
        eh = 1,
        ev = 1,
        ep = 0,
        eg = null,
        ex = null,
        ey = 0,
        ew = 0,
        eE = null,
        eb = null,
        eT = ef,
        eR = -1;
      await e.start(
        (r) => {
          let a,
            o,
            i,
            l,
            s,
            c,
            f,
            {
              W: h,
              Hh: p,
              resized: g,
            } = ((a = e.W),
            (o = e.Hh),
            (l = Math.round(a * (i = e.dpr))),
            (s = Math.round(o * i)),
            (c = w.width !== l || w.height !== s) &&
              ((w.width = l), (w.height = s)),
            b.setTransform(i, 0, 0, i, 0, 0),
            { W: a, Hh: o, resized: c }),
            y = e.G;
          if (
            (null == ex && ((ex = r), F()),
            null == eg &&
              ++ey >= 2 &&
              (!R || ef >= D || L[0].v.v.readyState >= 2 || r - ex > 2) &&
              (eg = r),
            Q &&
              !X &&
              ((X = 1),
              null == eg && (eg = r),
              (eT += Math.max(0, D + 4.5 + 0.2 - (r - eg + eT)))),
            G > 0)
          ) {
            let e = (performance.now() - G) / 1e3;
            (e > 0.25 &&
              !X &&
              ((X = 1),
              null == eg && (eg = r),
              (eT += Math.max(0, D + 4.5 + 0.2 - (r - eg + eT)))),
              e > 1 && (G = -1));
          }
          let A = ed ? ef : null == eg ? 0 : r - eg + eT,
            M = A - D;
          (O(N, "gone", M > 2.74),
            K(N, !(M > 2.74)),
            O($, "on", M > 3.7),
            K($, M > 3.7 && !$?.classList.contains("off")));
          {
            let e = 1 - W(A / 0.6);
            if (G > 0) {
              let t = (performance.now() - G) / 1e3;
              e = Math.max(
                e,
                t < 0.25 ? t / 0.25 : Math.max(0, 1 - (t - 0.25) / 0.7),
              );
            }
            I.style.opacity = (null == eg && !ed ? 1 : e).toFixed(3);
          }
          let S = -1,
            _ = 0;
          for (let e = 0; e < L.length; e++) {
            if (A < _ + L[e].d) {
              S = e;
              break;
            }
            _ += L[e].d;
          }
          if (
            (S !== P &&
              (L.forEach((e, t) => {
                if (t === S) {
                  let t = e.v.v;
                  t.playbackRate = e.rate;
                  try {
                    let r = Math.max(0, A - _) * e.rate,
                      a = !e.from || Number.isFinite(t.duration),
                      o = (e.from ? t.duration * e.from : 0) + r;
                    a &&
                      Math.abs(t.currentTime - o) > 0.08 &&
                      (t.currentTime = o);
                  } catch {}
                  ed || e.v.play();
                } else e.v.v.pause();
              }),
              (P = S)),
            (E.style.visibility = S >= 0 ? "hidden" : ""),
            S >= 0)
          ) {
            let t,
              a,
              o = L[S];
            o.v.v.readyState >= 2 &&
              !o.v.v.seeking &&
              o.v.v.currentTime > 0.04 &&
              (o.sampled = (0 | o.sampled) + 1) % 6 == 1 &&
              ((e) => {
                try {
                  e.colB = k(e, e.VH - 12).rgb;
                } catch {}
                try {
                  let t = k(e, 0);
                  t.sum > 6 * t.n && (e.col = t.rgb);
                } catch {}
              })(o);
            let i =
              ((t = o.v.v),
              (a = o.v.still),
              t.readyState >= 2 && !t.seeking
                ? ((o.shown = !0), t)
                : !o.shown && a.complete && a.naturalWidth
                  ? a
                  : null);
            ((i || g || !o.drawn) &&
              (((e, t, r, a, o, i) => {
                let n = t.cy - t.r,
                  l = o.A[1] - o.A[2],
                  s = t.r / o.A[2];
                o.top &&
                  !(a > r) &&
                  (s = Math.max(r / o.VW, (a - n) / (o.VH - l)));
                let c = t.cx - o.A[0] * s,
                  u = n - l * s,
                  d = u + o.VH * s,
                  [f, m, h] = o.col;
                if (
                  ((e.fillStyle = `rgb(${f},${m},${h})`),
                  e.fillRect(0, 0, r, a),
                  o.colB && d < a)
                ) {
                  let [t, i, n] = o.colB;
                  ((e.fillStyle = `rgb(${t},${i},${n})`),
                    e.fillRect(0, d - 2, r, a - d + 2));
                }
                if ((i && e.drawImage(i, c, u, o.VW * s, o.VH * s), u > 0)) {
                  let t = e.createLinearGradient(0, u - 1, 0, u + 90);
                  (t.addColorStop(0, `rgba(${f},${m},${h},1)`),
                    t.addColorStop(1, `rgba(${f},${m},${h},0)`),
                    (e.fillStyle = t),
                    e.fillRect(0, u - 1, r, 91));
                }
                if (o.colB && d < a) {
                  let [t, a, i] = o.colB,
                    n = e.createLinearGradient(0, d - 90, 0, d + 1);
                  (n.addColorStop(0, `rgba(${t},${a},${i},0)`),
                    n.addColorStop(1, `rgba(${t},${a},${i},1)`),
                    (e.fillStyle = n),
                    e.fillRect(0, d - 90, r, 91));
                }
              })(b, y, h, p, o, i),
              (o.drawn = !!i || !!o.drawn)),
              (Z = r),
              el(0, y),
              (e.navAway = !0),
              (e.animating = !ed));
            return;
          }
          b.clearRect(0, 0, h, p);
          let q = ed || null == Z ? 0 : Math.min(1 / 30, Math.max(0, r - Z));
          Z = r;
          let z = ed ? 0 : U(d, d + 2, M);
          {
            let e = 1 - Math.exp(-q / 0.25);
            ((Y.x += (j.x - Y.x) * e), (Y.y += (j.y - Y.y) * e));
          }
          let C = 14.100000000000001 / 100;
          if (z > 0) {
            let e = (j.x - 0.5) * 2,
              t = Math.max(0, Math.abs(e) - 0.06) / 0.94,
              r = t * t * (3 - 2 * t) * 0.5 + 0.5 * t;
            C =
              (14.100000000000001 / 100) *
              Math.pow(e < 0 ? Math.pow(0.03, r) : Math.pow(8, r), z);
          }
          (null == eE || null == eb) && (eE = eb = C);
          {
            let e = 1 - Math.exp(-q / 0.4);
            ((eE += (C - eE) * e), (eb += (eE - eb) * e));
          }
          ew += q * eb;
          let B = (30 * z) / 100,
            V = B * (Y.x - 0.5),
            H = B * (Y.y - 0.5),
            J = ed ? 0 : r,
            ee = W(M / 4.5),
            eo = (1 + (1.08 - 1) * (1 - ee)) * (1 + 0.004 * Math.sin(0.2 * J)),
            ei = y.r / x[2];
          M - 8.5 > 0 && (em = (em + q / 30) % 1);
          let eA = (e, r, a) => {
              let o = t((a - e) / (r - e), 0, 1);
              return o * o * o * (o * (6 * o - 15) + 10);
            },
            [eL, eM, eD] =
              (f = em) < 0.12 || f >= 0.88
                ? [1, 1, 0]
                : f < 0.5
                  ? [1 - eA(0.12, 0.45, f), 1 - 0.64 * eA(0.17, 0.5, f), 1]
                  : [eA(0.55, 0.88, f), 0.36 + 0.64 * eA(0.5, 0.83, f), 0];
          {
            let e = 1 - Math.exp(-q / 0.5);
            ((eh += (eL - eh) * e), (ev += (eM - ev) * e));
          }
          ep = eD;
          let eS = Math.min(0.34 + 0.6599999999999999 * U(0, 3, M), ev),
            e_ = Math.min(U(-0.6, 3.3, M), eh),
            ek = [ep ? 1.45 - 1.8 * e_ : -0.35 + 1.8 * e_, ep],
            eP = U(0.4, 0.62, eS) * (1 - U(0.7, 0.96, eS)),
            eF = null;
          if (
            !(innerHeight > innerWidth) &&
            !(innerWidth > innerHeight && innerHeight <= 540)
          ) {
            let e,
              r = ((e, t, r) => {
                let a = `${e}|${t}|${r.cy - r.r}`;
                if (ec && ec.key === a && ++ec.age < 30) return ec.at;
                let o = er?.querySelector(".toc"),
                  i = o?.getBoundingClientRect(),
                  n = m.getBoundingClientRect();
                return (ec = {
                  key: a,
                  age: 0,
                  at:
                    i && i.height > 10
                      ? {
                          x: i.left - n.left + i.width / 2,
                          y: i.top - n.top,
                          width: i.width,
                        }
                      : null,
                }).at;
              })(h, p, y);
            r &&
              (eF = [
                r.x,
                r.y,
                0.72 * r.width + 90,
                0,
                0.95 *
                  ((e = t((M - 1.3 - 0.72) / 1.44, 0, 1)) < 0.5
                    ? 4 * e * e * e
                    : 1 - Math.pow(-2 * e + 2, 3) / 2),
              ]);
          }
          let eq = ((r, a, o) => {
              if (!(innerHeight > innerWidth && innerWidth < 768))
                return { up: 0, fit: null };
              let i = ((t) => {
                  let r = e.landing(t);
                  if (eu && eu.key === r && ++eu.age < 30) return eu.top;
                  let a = ea ?? et,
                    o = a?.getBoundingClientRect();
                  return (eu = {
                    key: r,
                    age: 0,
                    top:
                      o && o.height > 0
                        ? o.top - m.getBoundingClientRect().top
                        : null,
                  }).top;
                })(a),
                n = a.cy - x[1] * o + 176 * o,
                l =
                  null == i
                    ? 0
                    : t((n - (i - (r < 600 ? 80 : 64))) / o, 0, 480),
                s = (r / 2 - 20) / o;
              return { up: l, fit: [s, s - 0.17 * (488 + l)] };
            })(h, y, ei),
            ez = ed || eR < 0 || r - eR >= u - 0.003 || r < eR;
          ez && (eR = eR < 0 || r - eR > 3 * u ? r : eR + u);
          let eC = Math.abs(eb) * u * 0.5;
          ez &&
            T.render({
              blur: eC,
              flow: ew,
              amt: 0.64,
              t: J,
              dawn: eS,
              warm: eP,
              shade: eF,
              W: h,
              Hh: p,
              mx: 0.5 - 0.9 * V,
              my: 0.5 - 2.4 * H,
              starP: 1.8,
              lean: [30 * V, 50 * H - (1 - ee) * 6],
              roll: 0.004 * V,
              term: ek,
              sunG: e_,
              land: 1,
              landX: 0,
              lens: 1,
              grade: 1,
              moon: 1,
              tag: 0,
              sheen: [1.3 * V, 2.8 * H],
              glass:
                (15.600000000000001 / 100) *
                (0.35 + 0.65 * z) *
                (0.32 + 0.68 * U(0.36, 0.9, eS)),
              dpr: Math.min(1, e.dpr, Math.sqrt(21e5 / Math.max(1, h * p))),
              xf: { s: ei, ox: y.cx - x[0] * ei, oy: y.cy - x[1] * ei },
              zoom: [eo, 962, x[1] - x[2] - 20],
              winX: 142,
              winUp: eq.up,
              winFit: eq.fit,
            });
          let eU = t((M - 1.3) / 2.4, 0, 1);
          if (innerHeight > innerWidth) {
            let e = y.cy - x[1] * ei + 815 * ei;
            en(
              n,
              "--toc-below",
              Math.min(
                p -
                  ((e, t) => {
                    let r = `${e}|${t}`;
                    if (es && es.key === r && ++es.age < 30) return es.px;
                    let a = er?.querySelector(".toc");
                    return (es = {
                      key: r,
                      age: 0,
                      px: Math.max(70, (a?.offsetHeight ?? 0) + 24),
                    }).px;
                  })(h, p),
                e + 56,
              ) + "px",
            );
          }
          ((e.navAway = 0.45 > el(0.2 + 0.8 * eU, y)), (e.animating = !ed));
        },
        { track: "100vh" },
      );
    }
    e.s(
      [
        "mountLaunchHero",
        0,
        function (e, i) {
          let n = (function (e) {
              let i, n;
              if (o)
                throw Error(
                  "launch hero: only one hero can be mounted at a time (its element ids are fixed)",
                );
              let l = !!(
                  window.matchMedia &&
                  matchMedia("(prefers-reduced-motion: reduce)").matches
                ),
                s = (t) => {
                  let r;
                  return ((r = "#" + t), e.querySelector(r));
                },
                c = [],
                u = new Set(),
                d = [],
                f = (e, t) => {
                  let r = setTimeout(() => {
                    (u.delete(r), e());
                  }, t);
                  return (u.add(r), r);
                },
                m = !1,
                h = 1,
                p = 1,
                g = 1,
                x = 1,
                y = (e, t = {}, r) => {
                  let o = document.createElementNS(a, e);
                  for (let e in t) o.setAttribute(e, t[e]);
                  return (r && r.appendChild(o), c.push(o), o);
                },
                w = 0,
                E = !0,
                b = !1,
                T = !1,
                R = !0,
                A = {
                  root: e,
                  get dirty() {
                    return R;
                  },
                  set dirty(v) {
                    ((R = v), v && F());
                  },
                  G: null,
                  REDUCED: l,
                  later: f,
                  own: (e) => (c.push(e), e),
                  onDestroy: (e) => d.push(e),
                  get destroyed() {
                    return m;
                  },
                  get W() {
                    return h;
                  },
                  get Hh() {
                    return p;
                  },
                  get dpr() {
                    return g;
                  },
                };
              function L() {
                let t = A.stage;
                ((h = t.clientWidth),
                  (p = t.clientHeight),
                  (g = Math.min(window.devicePixelRatio || 1, 2)),
                  A.ov.setAttribute("viewBox", `0 0 ${h} ${p}`),
                  (x =
                    parseFloat(
                      getComputedStyle(e).getPropertyValue("--hero-name-scale"),
                    ) || 1),
                  (A.dirty = !0));
              }
              o = A;
              let M = performance.now(),
                D = "",
                S = !0,
                _ = !0;
              function k() {
                S &&
                  ((S = !1),
                  (_ =
                    A.hero.getBoundingClientRect().bottom >
                    r.HERO_HEADER_CLEARANCE));
                let e = !!A.navAway,
                  t = _ + "|" + e;
                t !== D &&
                  ((D = t),
                  !_ && A.away && (A.away(), (A.dirty = !0)),
                  A.hero.dispatchEvent(
                    new CustomEvent("hero:nav", {
                      detail: { overHero: _, away: e },
                    }),
                  ));
              }
              function P(e) {
                ((w = 0),
                  (T = !0),
                  z && ((z = !1), L()),
                  (A.animating || R) &&
                    ((R = !1),
                    (A.G = (function (e = 0.5) {
                      let t = A.arcCap(h, p);
                      return { cx: h / 2, cy: e * p + t, r: t };
                    })(null == A.apex ? 0.5 : A.apex)),
                    A.scene((e - M) / 1e3)),
                  k(),
                  (T = !1),
                  !w &&
                    (A.animating || R) &&
                    E &&
                    !m &&
                    (w = requestAnimationFrame(P)));
              }
              function F() {
                !b || w || T || !E || m || (w = requestAnimationFrame(P));
              }
              let q = () => {
                  ((S = !0), F());
                },
                z = !1,
                C = () => {
                  ((z = !0),
                    (S = !0),
                    F(),
                    clearTimeout(i),
                    (i = setTimeout(() => {
                      ((z = !0), (S = !0), F());
                    }, 60)));
                };
              A.start = function (t, r = {}) {
                return (
                  (A.stage = e.querySelector(".stage")),
                  (A.ov = e.querySelector("#mh-ov")),
                  (A.hero = e),
                  (A.scene = t),
                  r.track && (A.hero.style.height = r.track),
                  L(),
                  addEventListener("resize", C),
                  addEventListener("scroll", q, { passive: !0 }),
                  A.stage.classList.add("loading"),
                  Promise.race([
                    (() => {
                      if (!document.fonts?.load) return Promise.resolve();
                      let t = (e) => (e ? getComputedStyle(e).fontFamily : ""),
                        r = t(s("mh-title")),
                        a = t(e.querySelector(".landing .eyebrow"));
                      return Promise.all(
                        [
                          r && `400 1em ${r}`,
                          r && `465 1em ${r}`,
                          a && `500 1em ${a}`,
                        ]
                          .filter(Boolean)
                          .map((e) => document.fonts.load(e).catch(() => [])),
                      )
                        .then(() => document.fonts.ready)
                        .then(() => void 0);
                    })(),
                    new Promise((e) => f(() => e(null), 12e3)),
                  ]).then(() => {
                    m ||
                      (X(),
                      (M = performance.now()),
                      (A.dirty = !0),
                      A.stage.classList.remove("loading"),
                      A.stage.classList.add("ready"),
                      (b = !0),
                      "IntersectionObserver" in window &&
                        (n = new IntersectionObserver((e) => {
                          ((E = e[e.length - 1].isIntersecting), (S = !0), E)
                            ? ((A.dirty = !0), F())
                            : (w && cancelAnimationFrame(w),
                              k(),
                              (R = !0),
                              P(performance.now()));
                        })).observe(A.hero),
                      (w = requestAnimationFrame(P)));
                  })
                );
              };
              let U = new WeakMap(),
                W = 0,
                B = (e, t) => {
                  let r = e.textContent,
                    a = U.get(e);
                  if (!a || a.txt !== r) {
                    let t = 0.5 * r.length;
                    if (e.getComputedTextLength) {
                      let r = e.getAttribute("font-size");
                      (e.setAttribute("font-size", String(17)),
                        (t = e.getComputedTextLength() / 17),
                        null == r
                          ? e.removeAttribute("font-size")
                          : e.setAttribute("font-size", r));
                    }
                    ((a = { txt: r, r: t }), U.set(e, a));
                  }
                  return a.r * t;
                },
                X = () => {
                  m ||
                    (e
                      .querySelectorAll("#mh-ov text")
                      .forEach((e) => U.delete(e)),
                    W++,
                    (A.dirty = !0));
                };
              document.fonts &&
                (document.fonts.ready.then(X),
                document.fonts.addEventListener?.("loadingdone", X),
                d.push(() =>
                  document.fonts.removeEventListener?.("loadingdone", X),
                ));
              let G = null,
                I = "";
              return (
                (A.landing = function (r) {
                  let o,
                    i =
                      A._landing || (A._landing = e.querySelector(".landing"));
                  if (!i) return "";
                  let {
                      key: n,
                      t1: l,
                      t2: c,
                    } = (function () {
                      let e = A.model || "",
                        t = h < 600,
                        r = e + "|" + t;
                      if (G?.key === r) return G;
                      let o = s("mh-title-g"),
                        i = s("mh-title"),
                        n =
                          s("mh-title2") ||
                          y("text", { id: "mh-title2", class: "title-x" }, o),
                        l = (e, t, r, o) => {
                          let i = document.createElementNS(a, e);
                          for (let e in t) i.setAttribute(e, t[e]);
                          return (
                            null != o && (i.textContent = o),
                            r.appendChild(i),
                            i
                          );
                        };
                      i.replaceChildren();
                      let c = l(
                          "textPath",
                          { href: "#mh-name-line", startOffset: "50%" },
                          i,
                        ),
                        u = l("tspan", { class: "claude" }, c, "Claud");
                      if (
                        (l("tspan", { class: "claude-e" }, u, "e"),
                        t || l("tspan", { class: "rest" }, c, " " + e),
                        n.replaceChildren(),
                        t)
                      ) {
                        let t = l(
                          "textPath",
                          { href: "#mh-name-line2", startOffset: "50%" },
                          n,
                        );
                        l("tspan", { class: "rest" }, t, e);
                      }
                      return (
                        (n.style.display = t ? "" : "none"),
                        i.setAttribute("opacity", "1"),
                        (G = { key: r, t1: i, t2: n })
                      );
                    })(),
                    u = [h, p, r.cy, r.r, x, W, n].join("|");
                  if (u === I) return I;
                  I = u;
                  let d = r.cy - r.r,
                    f = t(0.066 * h, 34, 112),
                    m = (e) => {
                      (e.setAttribute("font-size", f.toFixed(1)),
                        e.setAttribute("text-anchor", "middle"));
                    },
                    g = e.querySelector("#mh-ov defs"),
                    w =
                      s("mh-name-line") ||
                      y("path", { id: "mh-name-line", fill: "none" }, g),
                    E =
                      s("mh-name-line2") ||
                      y("path", { id: "mh-name-line2", fill: "none" }, g),
                    b = (e) =>
                      `M${(r.cx - 2400).toFixed(1)} ${(r.cy - e).toFixed(1)}L${(r.cx + 2400).toFixed(1)} ${(r.cy - e).toFixed(1)}`,
                    T = !!c.textContent?.trim(),
                    R = 16 * (h < 768);
                  if (
                    ((f = Math.min(
                      f * (T ? 1.5 : 1),
                      (0.84 * h) / Math.max(B(l, 1), T ? B(c, 1) : 0, 0.001),
                    )),
                    !T &&
                      A.titleMin &&
                      (f = Math.max(
                        f,
                        Math.min(
                          A.titleMin,
                          (0.84 * h) / Math.max(B(l, 1), 0.001),
                        ),
                      )),
                    !T && A.titleFit)
                  ) {
                    let e = A.titleFit(h, innerHeight);
                    e && (f = e / Math.max(B(l, 1), 0.001));
                  }
                  f *= x;
                  let L = r.r + 0.24 * f + R;
                  return (
                    T
                      ? (E.setAttribute("d", b(L)),
                        w.setAttribute("d", b(L + 1.05 * f)),
                        m(l),
                        m(c),
                        (o = d - 0.24 * f - R - 1.05 * f - 1.37 * f))
                      : (w.setAttribute("d", b(L)),
                        m(l),
                        (o = d - 0.24 * f - R - 1.37 * f)),
                    !(function (e, t) {
                      let r,
                        a,
                        o = e.querySelector(".claude-e");
                      if (!o || !e.parentNode) return;
                      let i = e.parentNode.querySelector(".claude-e-g"),
                        n = i && i.firstChild;
                      i ||
                        ((i = y("g", { class: "claude-e-g" })),
                        (n = y(
                          "path",
                          {
                            class: "claude-e-path",
                            d: "M69 527Q69 690 137.5 822Q206 954 327 1029Q448 1104 597 1104Q712 1104 807 1056.5Q902 1009 964.5 921.5Q1027 834 1047 719L309 487Q338 341 427.5 256Q517 171 652 171Q764 171 853.5 231.5Q943 292 1012 414L1090 389Q1065 267 993.5 173Q922 79 817 27.5Q712 -24 589 -24Q440 -24 321.5 47Q203 118 136 244Q69 370 69 527ZM546 993Q471 993 414.5 947Q358 901 327 816.5Q296 732 296 620Q296 600 297 590L792 752Q778 823 742.5 877.5Q707 932 656 962.5Q605 993 546 993Z",
                          },
                          i,
                        )),
                        e.parentNode.insertBefore(i, e.nextSibling));
                      try {
                        ((r = e.getStartPositionOfChar(5)),
                          (a = e.getRotationOfChar(5)));
                      } catch {
                        return;
                      }
                      o.classList.add("e-drawn");
                      let l = t / 2e3;
                      n.setAttribute(
                        "transform",
                        `translate(${r.x.toFixed(2)} ${r.y.toFixed(2)}) rotate(${a.toFixed(3)}) scale(${l.toFixed(5)} ${(-l).toFixed(5)})`,
                      );
                    })(l, f),
                    i.style.setProperty("--apex", d.toFixed(1) + "px"),
                    i.style.setProperty("--tsize", f.toFixed(1) + "px"),
                    i.style.setProperty("--ttop", o.toFixed(1) + "px"),
                    I
                  );
                }),
                (A.destroy = function () {
                  if (m) return;
                  ((m = !0),
                    w && cancelAnimationFrame(w),
                    (w = 0),
                    removeEventListener("resize", C),
                    removeEventListener("scroll", q),
                    clearTimeout(i),
                    u.forEach(clearTimeout),
                    u.clear(),
                    d.splice(0).forEach((e) => {
                      try {
                        e();
                      } catch (e) {}
                    }),
                    n && n.disconnect());
                  let t = s("mh-title"),
                    r = s("mh-title-g");
                  t &&
                    ((t.textContent = ""),
                    t.removeAttribute("font-size"),
                    t.setAttribute("opacity", "0"));
                  for (let e = c.length - 1; e >= 0; e--) c[e].remove();
                  ((c.length = 0),
                    r &&
                      (r.style.removeProperty("opacity"),
                      r.style.removeProperty("transform")),
                    A.stage?.classList.remove("loading", "ready"),
                    A.ov?.removeAttribute("viewBox"),
                    (e.style.height = ""));
                  let a = e.querySelector(".landing");
                  if (a)
                    for (let e of [
                      "opacity",
                      "visibility",
                      "--apex",
                      "--tsize",
                      "--ttop",
                    ])
                      a.style.removeProperty(e);
                  for (let t of [e, ...e.querySelectorAll("[style]")])
                    "" === t.getAttribute("style") &&
                      t.removeAttribute("style");
                  o === A && (o = null);
                }),
                A
              );
            })(e),
            l = () => n.destroy(),
            s = m(n, i).catch((e) => {
              throw (l(), e);
            });
          return { destroy: l, started: s };
        },
      ],
      630276,
    );
  },
]);
