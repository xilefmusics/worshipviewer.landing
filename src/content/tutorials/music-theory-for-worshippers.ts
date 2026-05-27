import type { TutorialEntry } from "@/lib/tutorial-content";

const asset = (file: string) =>
  `/tutorials/music-theory-for-worshippers/${file}`;

export const musicTheoryForWorshippers: TutorialEntry[] = [
  {
    type: "heading",
    id: "introduction",
    text: "Introduction",
    level: 2,
  },
  {
    type: "paragraph",
    text: "Hey there, you're probably here because you love Jesus and you love worshipping him.",
  },
  {
    type: "paragraph",
    text: "Maybe you know how to play the guitar or the piano, or not.",
  },
  {
    type: "paragraph",
    text: "Maybe you're a beginner or you know your instrument well.",
  },
  {
    type: "paragraph",
    text: "You're probably thinking music theory, pff, that's boring, that's complex, that's dry, but I have good news for you.",
  },
  {
    type: "paragraph",
    text: "Music theory can actually be really fun and it can help you improve and simplify your playing a lot and free up some space in your head while worshipping.",
  },
  {
    type: "paragraph",
    text: "The less you have to think while playing, the more focus you can have on actually worshipping and that's what we want, right?",
  },
  {
    type: "paragraph",
    text: "Therefore I think everyone benefits a lot from some basic understanding of how music works.",
  },
  {
    type: "paragraph",
    text: "And I have good news for you, contemporary worship music is simple, yes it's really deliberately simple.",
  },
  {
    type: "paragraph",
    text: "It's so simple it even feels dull to do when you know how complex other music can be.",
  },
  {
    type: "paragraph",
    text: "But why is this so?",
  },
  {
    type: "paragraph",
    text: "The music should support you in worshipping and get out of your way.",
  },
  {
    type: "paragraph",
    text: "Your focus should be to give all the glory to Jesus, to pour out your heart before him, to stand in awe and adoration before him and to surrender to his good plan for you and your life.",
  },
  {
    type: "paragraph",
    text: "Music is a gift that can help you express that and the bar should be as low as possible for everyone to join in and participate.",
  },
  {
    type: "paragraph",
    text: "I know we can praise him with complex music as well, it's a gift as well and there is so much beauty in it.",
  },
  {
    type: "paragraph",
    text: "If I hear the masterpieces of the ancient composers, my heart opens up and praises God for such beauty, but in this music not everyone can easily join in.",
  },
  {
    type: "paragraph",
    text: "Therefore I'm glad that we have this stripped-down contemporary worship music, which in its simplicity has a lot of beauty as well and is very well suited for worshipping all together.",
  },
  {
    type: "paragraph",
    text: "And since the music is simple and the bar should be low for everyone to join in, the same should hold for this course.",
  },
  {
    type: "paragraph",
    text: "So if you want a comprehensive course of all the facets of music and learn music theory the hard way, like I did, go and read a book of a few thousand lines.",
  },
  {
    type: "paragraph",
    text: "If you are a nerd like me, you probably have some fun in doing so, but for all the others I want to break it down to the most simple and most basic concepts you need to know, so that it should be easy to follow for everyone.",
  },
  {
    type: "paragraph",
    text: "My name is Felix and one thing you'll quickly realize about me: I'm a little nerd, you will probably notice at a few places within this course.",
  },
  {
    type: "paragraph",
    text: "I studied computer science and therefore do think a bit mathematical from time to time.",
  },
  {
    type: "paragraph",
    text: "I've learned music theory the hard way practicing all the scales, cadences, harmonies and much more like realtime harmonizing old hymns etc. while learning to play the organ.",
  },
  {
    type: "paragraph",
    text: "And it was quite a challenge for me to switch from doing that complex stuff to the simplicity of contemporary worship music without overdoing it.",
  },
  {
    type: "paragraph",
    text: "The simple patterns I will show you helped me a lot in staying inside that simplicity.",
  },
  {
    type: "paragraph",
    text: "So if you are a classical pianist, organist, or whatever your background, this course is for you as well.",
  },
  {
    type: "paragraph",
    text: "You're just like me, coming from the other side.",
  },
  {
    type: "paragraph",
    text: "Let's all meet in the middle.",
  },
  {
    type: "paragraph",
    text: "In this course you will learn how to play nice and easy chords without thinking about it too much.",
  },
  {
    type: "paragraph",
    text: "You probably saw chords like `F#m7add11` and thought what the heck, I'm not playing this.",
  },
  {
    type: "paragraph",
    text: "If you follow this course, you will and you won't even notice.",
  },
  {
    type: "paragraph",
    text: "I will introduce you to contextualized chords, where you don't have to think of any extensions, I mean that `7add11` stuff, because it will arise naturally without any thinking.",
  },
  {
    type: "paragraph",
    text: "You will play nice chords and sound like a pro with much more depth and color and fullness within your chords and playing and it will get simpler as well.",
  },
  {
    type: "paragraph",
    text: "I know this sounds too good to be true, but it enabled even me to play the guitar, and I'm not that good at bending my fingers.",
  },
  {
    type: "paragraph",
    text: "And it helped me to play without much mental effort so you can fully focus on worshipping.",
  },
  {
    type: "paragraph",
    text: "So let's get started.",
  },
  {
    type: "heading",
    id: "chapter-0",
    text: "0. Technical Background",
    level: 2,
  },
  {
    type: "paragraph",
    text: "Ever wondered why music theory is how it is, what a tone is and why we have twelve of them (twelve equal steps per octave)?",
  },
  {
    type: "paragraph",
    text: "No?",
  },
  {
    type: "paragraph",
    text: "That's completely fine.",
  },
  {
    type: "paragraph",
    text: "Feel free to skip this chapter and start with the real stuff.",
  },
  {
    type: "paragraph",
    text: "But if you're interested and have a few minutes I encourage you to read through it.",
  },
  {
    type: "paragraph",
    text: "You don't have to remember everything or even completely understand everything.",
  },
  {
    type: "paragraph",
    text: "But within the technical background of how music works there is so much beauty God put in, that we can discover, even though we only scratch the surface.",
  },
  {
    type: "paragraph",
    text: "The theory how music works is nothing we have created, but we have discovered it.",
  },
  {
    type: "paragraph",
    text: "It's beauty baked into the core physics of our world, wonderfully crafted.",
  },
  {
    type: "paragraph",
    text: "And we can use it to take pleasure in it and praise god with it.",
  },
  {
    type: "heading",
    id: "two-dimensions-of-a-tone",
    text: "The two dimensions of a tone",
    level: 3,
  },
  {
    type: "tone-simulator",
  },
  {
    type: "paragraph",
    text: "So what is a tone?",
  },
  {
    type: "paragraph",
    text: "It's like everything that is, it's a wave.",
  },
  {
    type: "paragraph",
    text: "Something that moves back and forth.",
  },
  {
    type: "paragraph",
    text: "For example if you pull on a string on your guitar, or press a key on the piano, a string moves back and forth.",
  },
  {
    type: "paragraph",
    text: "That string moves the air back and forth until it reaches your ear, then some parts in your ear move back and forth, and your brain translates it to something that we call a sound we can hear.",
  },
  {
    type: "paragraph",
    text: "Isn't that stunning?",
  },
  {
    type: "paragraph",
    text: "And there are two dimensions to it.",
  },
  {
    type: "paragraph",
    text: "How strong or wide it moves, which defines how intense and how loud the sound is, and how fast it moves, which defines how low or high the sound is.",
  },
  {
    type: "paragraph",
    text: "That's why when you pull hard on the string it becomes louder and if you make the string shorter, or if you tighten the string more, it moves faster and therefore becomes higher.",
  },
  {
    type: "heading",
    id: "its-all-about-color",
    text: "It's all about color",
    level: 3,
  },
  {
    type: "paragraph",
    text: "In music theory we only focus on the second dimension, how high it is.",
  },
  {
    type: "paragraph",
    text: "And in physics we measure it by how often it moves back and forth per second.",
  },
  {
    type: "paragraph",
    text: "For example if you pull your second string on the guitar, the A string, it vibrates about 110 times per second in standard tuning, and we call the frequency 110 Hz.",
  },
  {
    type: "paragraph",
    text: "So we have indefinitely many tones we can technically produce, everything from 0 Hz to infinity.",
  },
  {
    type: "paragraph",
    text: "But not everything we can hear.",
  },
  {
    type: "paragraph",
    text: "Most people can hear roughly between 20 Hz and 20 kHz (it varies with age and the individual).",
  },
  {
    type: "paragraph",
    text: "The range of a 88 key piano goes from 27,5 Hz up to 4.19k Hz.",
  },
  {
    type: "paragraph",
    text: "A guitar is much more limited, it goes from 82.4 Hz up to 1.39k Hz.",
  },
  {
    type: "paragraph",
    text: "But still in each of these ranges there is an infinite number of tones, because you can put as many digits after the period if you want, but at some point we are no longer able to distinguish it.",
  },
  {
    type: "heading",
    id: "making-the-continuous-scale-discrete",
    text: "Making the continuous scale discrete",
    level: 3,
  },
  {
    type: "paragraph",
    text: "But with such a continuous scale it's pretty hard to do theory with.",
  },
  {
    type: "paragraph",
    text: "It's hard enough to do theory with the twelve equal pitch steps we use in modern music, but it's impossible to do it with an infinite amount.",
  },
  {
    type: "paragraph",
    text: "So we just randomly pick twelve frequencies and define that this are our tones?",
  },
  {
    type: "paragraph",
    text: "That's exactly how many people think, but it's not random, it's designed into the core of physics, and to understand that we have to look into why a guitar sounds different than a piano, why a trumpet sounds different than a violin?",
  },
  {
    type: "paragraph",
    text: "Isn't it so that if I play the same tone on each of these instruments they have the exact same frequency?",
  },
  {
    type: "paragraph",
    text: "And I even can play them with the same intensity, so they have the same volume?",
  },
  {
    type: "paragraph",
    text: "That's right, but why do they sound different?",
  },
  {
    type: "heading",
    id: "overtones-or-harmonics",
    text: "Overtones or Harmonics",
    level: 3,
  },
  {
    type: "paragraph",
    text: "The answer is that a frequency almost never comes alone, it has some other frequencies that belong to it, that are backed into physics.",
  },
  {
    type: "paragraph",
    text: "These are called harmonics or overtones.",
  },
  {
    type: "paragraph",
    text: "So if you play a tone on any instrument, not only the base frequency of this tone is produced, but also an infinite amount of higher frequencies is produced, and the intensity of these higher frequencies defines the color of the tone.",
  },
  {
    type: "paragraph",
    text: "Listen to how those overtones show up as different \"colors\" in practice:",
  },
  {
    type: "audio",
    label: "Sine wave (pure tone)",
    src: asset("sine.wav"),
  },
  {
    type: "audio",
    label: "Piano tone",
    src: asset("piano.wav"),
  },
  {
    type: "audio",
    label: "Guitar tone",
    src: asset("guitar.wav"),
  },
  {
    type: "paragraph",
    text: "And that's why different instruments sound different, they have a different color, because their overtones are different.",
  },
  {
    type: "paragraph",
    text: "And the same effect which gives the tone itself color through the overtones is the effect we use in music theory to combine tones to create color.",
  },
  {
    type: "paragraph",
    text: "So we have to understand the overtones and what creates the color, to create color ourselves.",
  },
  {
    type: "paragraph",
    text: "I know now it gets really nerdy and I hope that you are still with me.",
  },
  {
    type: "heading",
    id: "octaves-are-the-same",
    text: "The first simplification: Octaves are the same",
    level: 3,
  },
  {
    type: "paragraph",
    text: "The first overtone/harmonic has just double the frequency.",
  },
  {
    type: "paragraph",
    text: "You can see it within the following picture.",
  },
  {
    type: "image",
    src: asset("octave.svg"),
    alt: "Wave diagram showing an octave interval",
    width: "full",
  },
  {
    type: "paragraph",
    text: "It's the points where the waves don't align that bring color.",
  },
  {
    type: "paragraph",
    text: "If you have double the frequency, they do align on every zero point of the base frequency, that is boring, that is almost no color.",
  },
  {
    type: "paragraph",
    text: "It's so boring that we even consider it the same tone in music theory.",
  },
  {
    type: "paragraph",
    text: "That's why on your piano every white key before the two black keys is called C, even though it is a different tone.",
  },
  {
    type: "paragraph",
    text: "The span between these two frequencies is what we call an octave.",
  },
  {
    type: "paragraph",
    text: "And now we notice the first simplification we make in music theory.",
  },
  {
    type: "paragraph",
    text: "If we consider every octave to a tone the same, we only have to focus on one octave, because after that everything is just repeating.",
  },
  {
    type: "paragraph",
    text: "But now we want some color, but the least amount of it.",
  },
  {
    type: "paragraph",
    text: "The next simple ratio we meet is 3:2, which corresponds to a perfect fifth.",
  },
  {
    type: "paragraph",
    text: "When you compare the waves for those two frequencies, the zero-crossings line up fairly often, but not as perfectly as in the octave, so it still sounds relatively pure.",
  },
  {
    type: "paragraph",
    text: "And you can see it within the next picture.",
  },
  {
    type: "image",
    src: asset("fifth.svg"),
    alt: "Wave diagram showing a perfect fifth interval",
    width: "full",
  },
  {
    type: "paragraph",
    text: "This interval we call a fifth.",
  },
  {
    type: "paragraph",
    text: "For the ultimate nerds under us: it comes from comparing harmonics, but since we treat octaves as the same tone, you hear it as a fifth relative to the root :)).",
  },
  {
    type: "paragraph",
    text: "We could go on like this forever and discover the whole family of simple intervals, but since you are probably already bored and I don't want to waste your time, we stop here; you see the pattern.",
  },
  {
    type: "paragraph",
    text: "The interval with the sharpest color we know is the small second.",
  },
  {
    type: "paragraph",
    text: "In the \"pure\" model this corresponds to the frequency ratio 16:15 (a minor second), which is exactly what the picture shows.",
  },
  {
    type: "image",
    src: asset("second.svg"),
    alt: "Wave diagram showing a minor second interval",
    width: "full",
  },
  {
    type: "heading",
    id: "equidistant-semitones",
    text: "The second simplification: Equidistant Semitones",
    level: 3,
  },
  {
    type: "paragraph",
    text: "From those overtones/harmonics we can build a picture of \"pure\" intervals like octaves (2:1), perfect fifths (3:2), and the small second (16:15).",
  },
  {
    type: "paragraph",
    text: "But here's the problem: if you want those simple ratios, you can't also make every key perfectly work at the same time.",
  },
  {
    type: "paragraph",
    text: "So we make another simplification: we divide the octave into twelve equal steps (semitones).",
  },
  {
    type: "paragraph",
    text: "In 12-tone equal temperament, each semitone step has the frequency ratio 2^(1/12) (about 1.05946).",
  },
  {
    type: "paragraph",
    text: "That means the \"minor second\" is close to 16:15, but not exact, so no key is perfectly in tune, yet all keys are equally usable.",
  },
  {
    type: "heading",
    id: "circle-of-fifths",
    text: "The Circle of Fifths",
    level: 3,
  },
  {
    type: "paragraph",
    text: "With this simplification we get something cool, because we can just use the fifth and repeat it to get around each of the 12 pitch classes, and after that it repeats.",
  },
  {
    type: "paragraph",
    text: "Which is called the famous circle of fifths.",
  },
  {
    type: "image",
    src: asset("circle-of-fifths-simple.svg"),
    alt: "Circle of fifths diagram",
    width: "half",
  },
  {
    type: "heading",
    id: "some-takeaways",
    text: "Some Takeaways",
    level: 3,
  },
  {
    type: "paragraph",
    text: "We now understand the foundation of our modern twelve-tone system.",
  },
  {
    type: "paragraph",
    text: "The key takeaway is that these twelve equidistant semitones fill an octave and repeat indefinitely.",
  },
  {
    type: "paragraph",
    text: "Each tone possesses its own unique character shaped by natural overtones and harmonics.",
  },
  {
    type: "paragraph",
    text: "By leaning into this God-given physics of sound, we can harness musical color to create genuine beauty.",
  },
  {
    type: "heading",
    id: "chapter-1",
    text: "1. Scales",
    level: 2,
  },
  {
    type: "scale-simulator",
  },
  {
    type: "heading",
    id: "chapter-2",
    text: "2. Chords",
    level: 2,
  },
  {
    type: "heading",
    id: "chapter-3",
    text: "3. Context",
    level: 2,
  },
  {
    type: "heading",
    id: "chapter-4",
    text: "4. Application Piano",
    level: 2,
  },
  {
    type: "heading",
    id: "chapter-5",
    text: "5. Application Guitar",
    level: 2,
  },
  {
    type: "heading",
    id: "chapter-6",
    text: "6. Chord Progressions",
    level: 2,
  },
  {
    type: "heading",
    id: "chapter-7",
    text: "7. Crazy Chords",
    level: 2,
  },
  {
    type: "heading",
    id: "chapter-8",
    text: "8. Experimenting with Context",
    level: 2,
  },
];
