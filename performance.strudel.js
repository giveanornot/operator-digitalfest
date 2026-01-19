/*
@title Don't expect to much
@by JN
@inspired By DJ_Dave - "Still Miss U" & After School - "Shh"
*/

//////// global vars ////////
setcpm(128/8)

const structNum = "<0 0 0 0 0 0 0 1>"
const roots = "{35 [35 38] 33 [33!7 34]}%2"

//////// bass drum ////////
const bdStruct = [
  "[x -]!8",
  "[x -!15]"
  ]

const bd = s("bd").bank("rolandTR909")
  .struct(pick(bdStruct, structNum))
  // ._pianoroll()


//////// snare drum ////////
const sdStruct = "[- x]!4"

const sd = s("sd").struct(sdStruct).bank("TR909")//.room(.2)
const cp = s("cp").struct(sdStruct).bank("TR909")//.room(.3)


//////// bass ////////
const bassStruct = [
  "[x!16]",
  "-"
]

// const sidechain = "[.4 0 0 0]!4"
const sidechain = "[0.2 1]!8"

const bass = s("gm_synth_bass_2").note(roots)
  .struct(pick(bassStruct, structNum))
  .gain(1).attack(.05).dist("2:.5").lpf(250)
  .superimpose(x => x.transpose(12).gain(.7))
  .postgain(sidechain)
  // ._pianoroll()

//////// lead ////////

// lead1
const lead1Struct = "{[[x*4 -*4] [- - x - - x - -]] <x(9,16) [x(3,8,2) x(5,8)]>}"
const lead1Clip = ".9 [[.9|1.25]*16]"

const lead1 = s("supersaw")
  .note(roots).superimpose(x => x.transpose(12))
  .struct(lead1Struct).clip(lead1Clip) 
  .dist("3:.3")
  .lpf(6000).delay(.5).delaytime(1/8).delayfb(.5)

// lead2 (is also a bass)
const lead2Notes = " \
  [0@2 0@2 -1@2  2@2 0@2 - 0@2 - 0@2]!3 \
  [0@2 0@2 -1@2 -3@2 0@2 - 0@2 - 0@2]"
  .slow(2)

const lead2 = n(lead2Notes)
  .superimpose(x => x.transpose(12))
  .sound("supersaw").scale("C2:minor")
  .lpf(150).lpe(7).decay(.3)
  .dist(2)
  .postgain(sidechain)

///////// opened hi-hat ////////
const ohStruct = "[- x]!8"
const oh = stack(
  // left
    s("oh").bank("TR909").n("0")
    .struct(ohStruct)
    .gain(.3).pan(-1)
  ,
  // right
    s("oh").bank("TR909").n("3")
    .struct(ohStruct)
    .gain(.7).pan(1)
  ,
)//.room(.2)


//////// melodies ////////
const arp = n(irand(3)).struct("[x -]!16").sound("supersaw").scale("C2:minor:pentatonic").octave("3")
  .delay(1).delayt(3/8)
  .bpf(cosine.range(2000,4000).slow(4)).bpq(.7)
  .ph("4")
  .jux(rev)
  .gain(.5)
  .room(.5)


//////// cymbal /////////
const cr = s("cr").bank("rolandTR909").n("2, 3")
  .struct("<x -!3 >")
  .pan(.5)

//////// noises ////////
const fall1 = s("white").struct("< x@2 -!6 >")
  .adsr("0:16:0:0").gain(.15).dist("1.5:.6")
  .hpf("2000")
  .lpf("20").lpa(8).lpenv(-10).lpd(0).lps(0).lpr(0).lpq(2)

const fall2 = s("white").struct("< x -!7 >")
  .adsr("0:12:0:0").gain(.15).dist("1.5:.6")
  .hpf("1000")
  .lpf("20").lpa(4).lpenv(-10).lpd(0).lps(0).lpr(0).lpq(1)

const fall = stack(
  fall1,
  fall2,
).postgain(.7)

const riser1 = s("white").struct("< -!6 x ->")
  .adsr("0:15:0:0").gain(.2).dry(.5).dist("2:.6").clip(2)
  .lpf("20").lpa(8).lpenv(10).lpd(0).lps(0).lpr(0).lpq(4)

const riser2 = s("white").struct("< -!7 x >")
  .adsr("0:8:0:0").gain(.2).dry(.5).dist("2:.6").clip(1)
  .lpf("800").lpa(4).lpenv(10).lpd(0).lps(0).lpr(0).lpq(4)

const reverseCr = s("tr909_cr").n("4").struct("<-!7 [-!6 x -]>").speed(-1).gain(2)

const riser = stack(
  riser1,
  riser2,
  reverseCr,
).postgain(.5)

const noises = stack(
  riser,
  fall,
)

//////// closed hi-hat ////////
const hhStruct = ("[x - - - x - -]!16")
const hh = s("hh").bank("TR909")
  .struct(hhStruct)
  .gain(rand.range(.2, .4)).n("{0 1 2 4}%91")
  .velocity(perlin.range(0.8,1))
  // .room(.2)

//////// mixer ////////
all: stack(
  bd,
  bass,
  cp, sd,
  // oh,
  // hh,
  cr, noises,
  // lead1,
  arp,
  )
.whenKey("Alt:d", x => x.hpf(saw.range(50,6000)).hpq(10).room(saw.range(.0, 4).slow(4)))
.whenKey("Alt:c", x => x.hpf(saw.range(50,8000).slow(2)).hpq(10).room(saw.range(.0, 4).slow(4)))
// .pianoroll()


loop: "1 2 3 4 5 6 7 8".slow(8)
beat: "1 2 3 4 5 6 7 8"
