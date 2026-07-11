// Nội dung đề Test 3 (Reading 3 passages + Listening 4 parts)
// Nguồn: "Cambridge IELTS 16, Test 4" — trích nguyên văn từ file gốc
// "C:\Users\ADMIN\OneDrive\Desktop\cam 16 test 4.pdf" mà Long gửi (đã xác nhận đủ đề +
// đáp án cho toàn bộ 40 câu Reading và 40 câu Listening, kể cả phần trước đó bị thiếu).

import {
  text,
  blank,
  type TestSection,
  type McqOption,
} from './test2-content'

const TFN_OPTIONS: McqOption[] = [
  { letter: 'TRUE', label: 'TRUE' },
  { letter: 'FALSE', label: 'FALSE' },
  { letter: 'NOT GIVEN', label: 'NOT GIVEN' },
]

const YNNG_OPTIONS: McqOption[] = [
  { letter: 'YES', label: 'YES' },
  { letter: 'NO', label: 'NO' },
  { letter: 'NOT GIVEN', label: 'NOT GIVEN' },
]

// ---------------------------------------------------------------------------
// READING PASSAGE 1 — "Roman tunnels"
// ---------------------------------------------------------------------------

export const READING_P1_SECTION: TestSection = {
  id: 'readingP1',
  label: 'Reading Passage 1',
  timeLabel: '20 phút',
  passageTitle: 'Roman tunnels',
  passageParagraphs: [
    'The Romans, who once controlled areas of Europe, North Africa and Asia Minor, adopted the construction techniques of other civilizations to build tunnels in their territories.',
    'The Persians, who lived in present-day Iran, were one of the first civilizations to build tunnels that provided a reliable supply of water to human settlements in dry areas. In the early first millennium BCE, they introduced the qanat method of tunnel construction, which consisted of placing posts over a hill in a straight line, to ensure that the tunnel kept to its route, and then digging vertical shafts down into the ground at regular intervals. Underground, workers removed the earth from between the ends of the shafts, creating a tunnel. The excavated soil was taken up to the surface using the shafts, which also provided ventilation during the work. Once the tunnel was completed, it allowed water to flow from the top of a hillside down towards a canal, which supplied water for human use. Remarkably, some qanats built by the Persians 2,700 years ago are still in use today.',
    'They later passed on their knowledge to the Romans, who also used the qanat method to construct water-supply tunnels for agriculture. Roman qanat tunnels were constructed with vertical shafts dug at intervals of between 30 and 60 meters. The shafts were equipped with handholds and footholds to help those climbing in and out of them and were covered with a wooden or stone lid. To ensure that the shafts were vertical, Romans hung a plumb line from a rod placed across the top of each shaft and made sure that the weight at the end of it hung in the center of the shaft. Plumb lines were also used to measure the depth of the shaft and to determine the slope of the tunnel. The 5.6-kilometer-long Claudius tunnel, built in 41 CE to drain the Fucine Lake in central Italy, had shafts that were up to 122 meters deep, took 11 years to build and involved approximately 30,000 workers.',
    "By the 6th century BCE, a second method of tunnel construction appeared called the counter-excavation method, in which the tunnel was constructed from both ends. It was used to cut through high mountains when the qanat method was not a practical alternative. This method required greater planning and advanced knowledge of surveying, mathematics and geometry as both ends of a tunnel had to meet correctly at the center of the mountain. Adjustments to the direction of the tunnel also had to be made whenever builders encountered geological problems or when it deviated from its set path. They constantly checked the tunnel's advancing direction, for example, by looking back at the light that penetrated through the tunnel mouth, and made corrections whenever necessary. Large deviations could happen, and they could result in one end of the tunnel not being usable. An inscription written on the side of a 428-meter tunnel, built by the Romans as part of the Saldae aqueduct system in modern-day Algeria, describes how the two teams of builders missed each other in the mountain and how the later construction of a lateral link between both corridors corrected the initial error.",
    'The Romans dug tunnels for their roads using the counter-excavation method, whenever they encountered obstacles such as hills or mountains that were too high for roads to pass over. An example is the 37-meter-long, 6-meter-high, Furlo Pass Tunnel built in Italy in 69-79 CE. Remarkably, a modern road still uses this tunnel today. Tunnels were also built for mineral extraction. Miners would locate a mineral vein and then pursue it with shafts and tunnels underground. Traces of such tunnels used to mine gold can still be found at the Dolaucothi mines in Wales. When the sole purpose of a tunnel was mineral extraction, construction required less planning, as the tunnel route was determined by the mineral vein.',
    'Roman tunnel projects were carefully planned and carried out. The length of time it took to construct a tunnel depended on the method being used and the type of rock being excavated. The qanat construction method was usually faster than the counter-excavation method as it was more straightforward. This was because the mountain could be excavated not only from the tunnel mouths but also from shafts. The type of rock could also influence construction times. When the rock was hard, the Romans employed a technique called fire quenching which consisted of heating the rock with fire, and then suddenly cooling it with cold water so that it would crack. Progress through hard rock could be very slow, and it was not uncommon for tunnels to take years, if not decades, to be built. Construction marks left on a Roman tunnel in Bologna show that the rate of advance through solid rock was 30 centimeters per day. In contrast, the rate of advance of the Claudius tunnel can be calculated at 1.4 meters per day. Most tunnels had inscriptions showing the names of patrons who ordered construction and sometimes the name of the architect. For example, the 1.4-kilometer Çevlik tunnel in Turkey, built to divert the floodwater threatening the harbor of the ancient city of Seleuceia Pieria, had inscriptions on the entrance, still visible today, that also indicate that the tunnel was started in 69 CE and was completed in 81 CE.',
  ],
  totalQuestions: 13,
  groups: [
    {
      kind: 'fill',
      title: 'Questions 1 – 6',
      instruction: 'Label the diagrams below. Choose ONE WORD ONLY from the passage for each answer.',
      imageSrc: '/images/test3/qanat-diagram.png',
      imageAlt: 'The Persian Qanat Method và Cross-section of a Roman Qanat Shaft',
      asLines: true,
      blocks: [
        [text('1  '), blank(1), text(' to direct the tunnelling')],
        [text('2  water runs into a '), blank(2), text(' used by local people')],
        [text('3  vertical shafts to remove earth and for '), blank(3)],
        [text('4  '), blank(4), text(' made of wood or stone')],
        [text('5  '), blank(5), text(' attached to the plumb line')],
        [text('6  handholds and footholds used for '), blank(6)],
      ],
      answers: {
        1: ['posts'],
        2: ['canal'],
        3: ['ventilation'],
        4: ['lid'],
        5: ['weight'],
        6: ['climbing'],
      },
    },
    {
      kind: 'mcq',
      title: 'Questions 7 – 10',
      instruction:
        'Do the following statements agree with the information given in Reading Passage 1? TRUE / FALSE / NOT GIVEN',
      items: [
        {
          number: 7,
          prompt: 'The counter-excavation method completely replaced the qanat method in the 6th century BCE.',
          options: TFN_OPTIONS,
        },
        {
          number: 8,
          prompt: 'Only experienced builders were employed to construct a tunnel using the counter-excavation method.',
          options: TFN_OPTIONS,
        },
        {
          number: 9,
          prompt:
            'The information about a problem that occurred during the construction of the Saldae aqueduct system was found in an ancient book.',
          options: TFN_OPTIONS,
        },
        {
          number: 10,
          prompt: 'The mistake made by the builders of the Saldae aqueduct system was that the two parts of the tunnel failed to meet.',
          options: TFN_OPTIONS,
        },
      ],
      answers: { 7: 'FALSE', 8: 'NOT GIVEN', 9: 'FALSE', 10: 'TRUE' },
    },
    {
      kind: 'fill',
      title: 'Questions 11 – 13',
      instruction: 'Answer the questions below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      asLines: true,
      blocks: [
        [text('11  What type of mineral were the Dolaucothi mines in Wales built to extract?  '), blank(11)],
        [text('12  In addition to the patron, whose name might be carved onto a tunnel?  '), blank(12)],
        [text('13  What part of Seleuceia Pieria was the Çevlik tunnel built to protect?  '), blank(13)],
      ],
      answers: {
        11: ['gold'],
        12: ['architect'],
        13: ['harbor', 'harbour'],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// READING PASSAGE 2 — "Changes in reading habits"
// ---------------------------------------------------------------------------

export const READING_P2_SECTION: TestSection = {
  id: 'readingP2',
  label: 'Reading Passage 2',
  timeLabel: '20 phút',
  passageTitle: 'Changes in reading habits',
  passageParagraphs: [
    'What are the implications of the way we read today?',
    'Look around on your next plane trip. The iPad is the new pacifier for babies and toddlers. Younger school-aged children read stories on smartphones; older kids don\'t read at all, but hunch over video games. Parents and other passengers read on tablets or skim a flotilla of email and news feeds. Unbeknown to most of us, an invisible, game-changing transformation links everyone in this picture: the neuronal circuit that underlies the brain\'s ability to read is subtly, rapidly changing and this has implications for everyone from the pre-reading toddler to the expert adult.',
    'As work in neurosciences indicates, the acquisition of literacy necessitated a new circuit in our species\' brain more than 6,000 years ago. That circuit evolved from a very simple mechanism for decoding basic information, like the number of goats in one\'s herd, to the present, highly elaborated reading brain. My research depicts how the present reading brain enables the development of some of our most important intellectual and affective processes: internalized knowledge, analogical reasoning, and inference; perspective-taking and empathy; critical analysis and the generation of insight. Research surfacing in many parts of the world now cautions that each of these essential \'deep reading\' processes may be under threat as we move into digital-based modes of reading.',
    'This is not a simple, binary issue of print versus digital reading and technological innovation. As MIT scholar Sherry Turkle has written, we do not err as a society when we innovate but when we ignore what we disrupt or diminish while innovating. In this hinge moment between print and digital cultures, society needs to confront what is diminishing in the expert reading circuit, what our children and older students are not developing, and what we can do about it.',
    'We know from research that the reading circuit is not given to human beings through a genetic blueprint like vision or language; it needs an environment to develop. Further, it will adapt to that environment\'s requirements – from different writing systems to the characteristics of whatever medium is used. If the dominant medium advantages processes that are fast, multi-task oriented and well-suited for large volumes of information, like the current digital medium, so will the reading circuit. As UCLA psychologist Patricia Greenfield writes, the result is that less attention and time will be allocated to slower, time-demanding deep reading processes.',
    'Increasing reports from educators and from researchers in psychology and the humanities bear this out. English literature scholar and teacher Mark Edmundson describes how many college students actively avoid the classic literature of the 19th and 20th centuries in favour of something simpler as they no longer have the patience to read longer, denser, more difficult texts. We should be less concerned with students\' \'cognitive impatience\', however, than by what may underlie it: the potential inability of large numbers of students to read with a level of critical analysis sufficient to comprehend the complexity of thought and argument found in more demanding texts.',
    'Multiple studies show that digital screen use may be causing a variety of troubling downstream effects on reading comprehension in older high school and college students. In Stavanger, Norway, psychologist Anne Mangen and her colleagues studied how high school students comprehend the same material in different mediums. Mangen\'s group asked subjects questions about a short story whose plot had universal student appeal; half of the students read the story on a tablet, the other half in paperback. Results indicated that students who read on print were superior in their comprehension to screen-reading peers, particularly in their ability to sequence detail and reconstruct the plot in chronological order.',
    'Ziming Liu from San Jose State University has conducted a series of studies which indicate that the "new norm" in reading is skimming, involving word-spotting and browsing through the text. Many readers now use a pattern when reading in which they sample the first line and then word-spot through the rest of the text. When the reading brain skims like this, it reduces time allocated to deep reading processes. In other words, we don\'t have time to grasp complexity, to understand another\'s feelings, to perceive beauty, and to create thoughts of the reader\'s own.',
    'The possibility that critical analysis, empathy and other deep reading processes could become the unintended \'collateral damage\' of our digital culture is not a straightforward binary issue about print versus digital reading. It is about how we all have begun to read on various mediums and how that changes not only what we read, but also the purposes for which we read. Nor is it only about the young. The subtle atrophy of critical analysis and empathy affects us all equally. It affects our ability to navigate a constant bombardment of information. It incentivizes a retreat to the most familiar stores of unchecked information, which require and receive no analysis, leaving us susceptible to false information and irrational ideas.',
    'There\'s an old rule in neuroscience that does not alter with age: use it or lose it. It is a very hopeful principle when applied to critical thought in the reading brain because it implies choice. The story of the changing reading brain is hardly finished. We possess both the science and the technology to identify and redress the changes in how we read before they become entrenched. If we work to understand exactly what we will lose, alongside the extraordinary new capacities that the digital world has brought us, there is as much reason for excitement as caution.',
  ],
  totalQuestions: 13,
  groups: [
    {
      kind: 'mcq',
      title: 'Questions 14 – 17',
      instruction: 'Choose the correct letter, A, B, C or D.',
      items: [
        {
          number: 14,
          prompt: "What is the writer's main point in the first paragraph?",
          options: [
            { letter: 'A', label: 'Our use of technology is having a hidden effect on us.' },
            { letter: 'B', label: 'Technology can be used to help youngsters to read.' },
            { letter: 'C', label: 'Travellers should be encouraged to use technology on planes.' },
            { letter: 'D', label: 'Playing games is a more popular use of technology than reading.' },
          ],
        },
        {
          number: 15,
          prompt: 'What main point does Sherry Turkle make about innovation?',
          options: [
            { letter: 'A', label: 'Technological innovation has led to a reduction in print reading.' },
            { letter: 'B', label: 'We should pay attention to what might be lost when innovation occurs.' },
            { letter: 'C', label: 'We should encourage more young people to become involved in innovation.' },
            { letter: 'D', label: 'There is a difference between developing products and developing ideas.' },
          ],
        },
        {
          number: 16,
          prompt: 'What point is the writer making in the fourth paragraph?',
          options: [
            { letter: 'A', label: 'Humans have an inborn ability to read and write.' },
            { letter: 'B', label: 'Reading can be done using many different mediums.' },
            { letter: 'C', label: 'Writing systems make unexpected demands on the brain.' },
            { letter: 'D', label: 'Some brain circuits adjust to whatever is required of them.' },
          ],
        },
        {
          number: 17,
          prompt: 'According to Mark Edmundson, the attitude of college students',
          options: [
            { letter: 'A', label: 'has changed the way he teaches.' },
            { letter: 'B', label: 'has influenced what they select to read.' },
            { letter: 'C', label: 'does not worry him as much as it does others.' },
            { letter: 'D', label: 'does not match the views of the general public.' },
          ],
        },
      ],
      answers: { 14: 'A', 15: 'B', 16: 'D', 17: 'B' },
    },
    {
      kind: 'fill',
      title: 'Questions 18 – 22 — Studies on digital screen use',
      instruction:
        'Complete the summary using the list of words, A-H, below. Chọn từ trong danh sách cho mỗi ô trống.',
      wordBank: [
        { letter: 'A', label: 'fast' },
        { letter: 'B', label: 'isolated' },
        { letter: 'C', label: 'emotional' },
        { letter: 'D', label: 'worrying' },
        { letter: 'E', label: 'many' },
        { letter: 'F', label: 'hard' },
        { letter: 'G', label: 'combined' },
        { letter: 'H', label: 'thorough' },
      ],
      blocks: [
        [
          text('There have been many studies on digital screen use, showing some '),
          blank(18),
          text(
            " trends. Psychologist Anne Mangen gave high-school students a short story to read, half using digital and half using print mediums. Her team then used a question-and-answer technique to find out how "
          ),
          blank(19),
          text(" each group's understanding of the plot was. The findings showed a clear pattern in the responses, with those who read screens finding the order of information "),
          blank(20),
          text(' to recall.'),
        ],
        [
          text('Studies by Ziming Liu show that students are tending to read '),
          blank(21),
          text(' words and phrases in a text to save time. This approach, she says, gives the reader a superficial understanding of the '),
          blank(22),
          text(' content of material, leaving no time for thought.'),
        ],
      ],
      answers: {
        18: ['D'],
        19: ['H'],
        20: ['F'],
        21: ['B'],
        22: ['C'],
      },
    },
    {
      kind: 'mcq',
      title: 'Questions 23 – 26',
      instruction: 'Do the following statements agree with the views of the writer in Reading Passage 2? YES / NO / NOT GIVEN',
      items: [
        {
          number: 23,
          prompt: 'The medium we use to read can affect our choice of reading content.',
          options: YNNG_OPTIONS,
        },
        {
          number: 24,
          prompt: 'Some age groups are more likely to lose their complex reading skills than others.',
          options: YNNG_OPTIONS,
        },
        {
          number: 25,
          prompt: "False information has become more widespread in today's digital era.",
          options: YNNG_OPTIONS,
        },
        {
          number: 26,
          prompt: 'We still have opportunities to rectify the problems that technology is presenting.',
          options: YNNG_OPTIONS,
        },
      ],
      answers: { 23: 'YES', 24: 'NO', 25: 'NOT GIVEN', 26: 'YES' },
    },
  ],
}

// ---------------------------------------------------------------------------
// READING PASSAGE 3 — "Attitudes towards Artificial Intelligence"
// ---------------------------------------------------------------------------

export const READING_P3_SECTION: TestSection = {
  id: 'readingP3',
  label: 'Reading Passage 3',
  timeLabel: '20 phút',
  passageTitle: 'Attitudes towards Artificial Intelligence',
  passageParagraphs: [
    'A  Artificial intelligence (AI) can already predict the future. Police forces are using it to map when and where crime is likely to occur. Doctors can use it to predict when a patient is most likely to have a heart attack or stroke. Researchers are even trying to give AI imagination so it can plan for unexpected consequences.',
    "Many decisions in our lives require a good forecast, and AI is almost always better at forecasting than we are. Yet for all these technological advances, we still seem to deeply lack confidence in AI predictions. Recent cases show that people don't like relying on AI and prefer to trust human experts, even if these experts are wrong.",
    'If we want AI to really benefit people, we need to find a way to get people to trust it. To do that, we need to understand why people are so reluctant to trust AI in the first place.',
    "B  Take the case of Watson for Oncology, one of technology giant IBM's supercomputer programs. Their attempt to promote this program to cancer doctors was a PR disaster. The AI promised to deliver top-quality recommendations on the treatment of 12 cancers that accounted for 80% of the world's cases. But when doctors first interacted with Watson, they found themselves in a rather difficult situation. On the one hand, if Watson provided guidance about a treatment that coincided with their own opinions, physicians did not see much point in Watson's recommendations. The supercomputer was simply telling them what they already knew, and these recommendations did not change the actual treatment. On the other hand, if Watson generated a recommendation that contradicted the experts' opinion, doctors would typically conclude that Watson wasn't competent. And the machine wouldn't be able to explain why its treatment was plausible because its machine-learning algorithms were simply too complex to be fully understood by humans. Consequently, this has caused even more suspicion and disbelief, leading many doctors to ignore the seemingly outlandish AI recommendations and stick to their own expertise.",
    "C  This is just one example of people's lack of confidence in AI and their reluctance to accept what AI has to offer. Trust in other people is often based on our understanding of how others think and having experience of their reliability. This helps create a psychological feeling of safety. AI, on the other hand, is still fairly new and unfamiliar to most people. Even if it can be technically explained (and that's not always the case), AI's decision-making process is usually too difficult for most people to comprehend. And interacting with something we don't understand can cause anxiety and give us a sense that we're losing control.",
    'Many people are also simply not familiar with many instances of AI actually working, because it often happens in the background. Instead, they are acutely aware of instances where AI goes wrong. Embarrassing AI failures receive a disproportionate amount of media attention, emphasising the message that we cannot rely on technology. Machine learning is not foolproof, in part because the humans who design it aren\'t.',
    'D  Feelings about AI run deep. In a recent experiment, people from a range of backgrounds were given various sci-fi films about AI to watch and then asked questions about automation in everyday life. It was found that, regardless of whether the film they watched depicted AI in a positive or negative light, simply watching a cinematic vision of our technological future polarised the participants\' attitudes. Optimists became more extreme in their enthusiasm for AI and sceptics became even more guarded.',
    'This suggests people use relevant evidence about AI in a biased manner to support their existing attitudes, a deep-rooted human tendency known as "confirmation bias". As AI is represented more and more in media and entertainment, it could lead to a society split between those who benefit from AI and those who reject it. More pertinently, refusing to accept the advantages offered by AI could place a large group of people at a serious disadvantage.',
    'E  Fortunately, we already have some ideas about how to improve trust in AI. Simply having previous experience with AI can significantly improve people\'s opinions about the technology, as was found in the study mentioned above. Evidence also suggests the more you use other technologies such as the internet, the more you trust them.',
    'Another solution may be to reveal more about the algorithms which AI uses and the purposes they serve. Several high-profile social media companies and online marketplaces already release transparency reports about government requests and surveillance disclosures. A similar practice for AI could help people have a better understanding of the way algorithmic decisions are made.',
    'F  Research suggests that allowing people some control over AI decision-making could also improve trust and enable AI to learn from human experience. For example, one study showed that when people were allowed the freedom to slightly modify an algorithm, they felt more satisfied with its decisions, more likely to believe it was superior and more likely to use it in the future.',
    "We don't need to understand the intricate inner workings of AI systems, but if people are given a degree of responsibility for how they are implemented, they will be more willing to accept AI into their lives.",
  ],
  totalQuestions: 14,
  groups: [
    {
      kind: 'matching',
      title: 'Questions 27 – 32',
      instruction:
        'Reading Passage 3 has six sections, A-F. Choose the correct heading for each section from the list of headings below.',
      optionsTitle: 'List of Headings',
      picker: 'dropdown',
      options: [
        { letter: 'i', label: 'An increasing divergence of attitudes towards AI' },
        { letter: 'ii', label: 'Reasons why we have more faith in human judgement than in AI' },
        { letter: 'iii', label: 'The superiority of AI projections over those made by humans' },
        { letter: 'iv', label: 'The process by which AI can help us make good decisions' },
        { letter: 'v', label: 'The advantages of involving users in AI processes' },
        { letter: 'vi', label: 'Widespread distrust of an AI innovation' },
        { letter: 'vii', label: 'Encouraging openness about how AI functions' },
        { letter: 'viii', label: 'A surprisingly successful AI application' },
      ],
      items: [
        { number: 27, prompt: 'Section A' },
        { number: 28, prompt: 'Section B' },
        { number: 29, prompt: 'Section C' },
        { number: 30, prompt: 'Section D' },
        { number: 31, prompt: 'Section E' },
        { number: 32, prompt: 'Section F' },
      ],
      answers: { 27: 'iii', 28: 'vi', 29: 'ii', 30: 'i', 31: 'vii', 32: 'v' },
    },
    {
      kind: 'mcq',
      title: 'Questions 33 – 35',
      instruction: 'Choose the correct letter, A, B, C or D.',
      items: [
        {
          number: 33,
          prompt: 'What is the writer doing in Section A?',
          options: [
            { letter: 'A', label: 'providing a solution to a concern' },
            { letter: 'B', label: 'justifying an opinion about an issue' },
            { letter: 'C', label: 'highlighting the existence of a problem' },
            { letter: 'D', label: 'explaining the reasons for a phenomenon' },
          ],
        },
        {
          number: 34,
          prompt: 'According to Section C, why might some people be reluctant to accept AI?',
          options: [
            { letter: 'A', label: 'They are afraid it will replace humans in decision-making jobs.' },
            { letter: 'B', label: 'Its complexity makes them feel that they are at a disadvantage.' },
            { letter: 'C', label: 'They would rather wait for the technology to be tested over a period of time.' },
            { letter: 'D', label: 'Misunderstandings about how it works make it seem more challenging than it is.' },
          ],
        },
        {
          number: 35,
          prompt: 'What does the writer say about the media in Section C of the text?',
          options: [
            { letter: 'A', label: 'It leads the public to be mistrustful of AI.' },
            { letter: 'B', label: 'It devotes an excessive amount of attention to AI.' },
            { letter: 'C', label: 'Its reports of incidents involving AI are often inaccurate.' },
            { letter: 'D', label: 'It gives the impression that AI failures are due to designer error.' },
          ],
        },
      ],
      answers: { 33: 'C', 34: 'B', 35: 'A' },
    },
    {
      kind: 'mcq',
      title: 'Questions 36 – 40',
      instruction: 'Do the following statements agree with the claims of the writer in Reading Passage 3? YES / NO / NOT GIVEN',
      items: [
        {
          number: 36,
          prompt: 'Subjective depictions of AI in sci-fi films make people change their opinions about automation.',
          options: YNNG_OPTIONS,
        },
        {
          number: 37,
          prompt: 'Portrayals of AI in media and entertainment are likely to become more positive.',
          options: YNNG_OPTIONS,
        },
        {
          number: 38,
          prompt: "Rejection of the possibilities of AI may have a negative effect on many people's lives.",
          options: YNNG_OPTIONS,
        },
        {
          number: 39,
          prompt: "Familiarity with AI has very little impact on people's attitudes to the technology.",
          options: YNNG_OPTIONS,
        },
        {
          number: 40,
          prompt: 'AI applications which users are able to modify are more likely to gain consumer approval.',
          options: YNNG_OPTIONS,
        },
      ],
      answers: { 36: 'NO', 37: 'NOT GIVEN', 38: 'YES', 39: 'NO', 40: 'YES' },
    },
  ],
}

// ---------------------------------------------------------------------------
// LISTENING PART 1 — "Holiday rental"
// ---------------------------------------------------------------------------

export const LISTENING_P1_SECTION: TestSection = {
  id: 'listeningS1',
  label: 'Listening Part 1',
  timeLabel: '15 phút',
  audioSrc: '/audio/test3/part1.mp3',
  totalQuestions: 10,
  groups: [
    {
      kind: 'fill',
      title: 'Holiday rental',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      blocks: [
        [text("Owners' names: Jack Fitzgerald and Shirley Fitzgerald")],
        [text('Granary Cottage')],
        [text('•  available for week beginning '), blank(1), text(' May')],
        [text('•  cost for the week: £'), blank(2)],
        [blank(3), text(' Cottage')],
        [text('•  cost for the week: £480')],
        [text('•  building was originally a '), blank(4)],
        [text('•  walk through doors from living room into a '), blank(5)],
        [text('•  several '), blank(6), text(' spaces at the front')],
        [text('•  bathroom has a shower')],
        [text('•  central heating and stove that burns '), blank(7)],
        [text('•  views of old '), blank(8), text(' from living room')],
        [text('•  view of hilltop '), blank(9), text(' from the bedroom')],
        [text('Payment')],
        [text('•  deposit: £144')],
        [text('•  deadline for final payment: end of '), blank(10)],
      ],
      answers: {
        1: ['28th', '28'],
        2: ['550'],
        3: ['chervil'],
        4: ['garage'],
        5: ['garden'],
        6: ['parking'],
        7: ['wood'],
        8: ['bridge'],
        9: ['monument'],
        10: ['march'],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// LISTENING PART 2 — "Local council report on traffic and highways" + map
// ---------------------------------------------------------------------------

export const LISTENING_P2_SECTION: TestSection = {
  id: 'listeningS2',
  label: 'Listening Part 2',
  timeLabel: '15 phút',
  audioSrc: '/audio/test3/part2.mp3',
  totalQuestions: 10,
  groups: [
    {
      kind: 'mcq',
      title: 'Questions 11 – 14 — Local council report on traffic and highways',
      instruction: 'Choose the correct letter, A, B or C.',
      items: [
        {
          number: 11,
          prompt: "A survey found people's main concern about traffic in the area was",
          options: [
            { letter: 'A', label: 'cuts to public transport.' },
            { letter: 'B', label: 'poor maintenance of roads.' },
            { letter: 'C', label: 'changes in the type of traffic.' },
          ],
        },
        {
          number: 12,
          prompt: 'Which change will shortly be made to the cycle path next to the river?',
          options: [
            { letter: 'A', label: 'It will be widened.' },
            { letter: 'B', label: 'It will be extended.' },
            { letter: 'C', label: 'It will be resurfaced.' },
          ],
        },
        {
          number: 13,
          prompt: 'Plans for a pedestrian crossing have been postponed because',
          options: [
            { letter: 'A', label: 'the Post Office has moved.' },
            { letter: 'B', label: 'the proposed location is unsafe.' },
            { letter: 'C', label: 'funding is not available at present.' },
          ],
        },
        {
          number: 14,
          prompt: 'On Station Road, notices have been erected',
          options: [
            { letter: 'A', label: 'telling cyclists not to leave their bikes outside the station ticket office.' },
            { letter: 'B', label: 'asking motorists to switch off engines when waiting at the level crossing.' },
            { letter: 'C', label: 'warning pedestrians to leave enough time when crossing the railway line.' },
          ],
        },
      ],
      answers: { 11: 'C', 12: 'A', 13: 'B', 14: 'B' },
    },
    {
      kind: 'matching',
      title: 'Questions 15 – 20',
      instruction: 'Label the map below. Write the correct letter, A-I, next to Questions 15-20.',
      optionsTitle: 'Recreation ground after proposed changes',
      optionsImage: '/images/test3/recreation-ground-map.png',
      layout: 'split',
      picker: 'grid',
      options: [
        { letter: 'A', label: '' },
        { letter: 'B', label: '' },
        { letter: 'C', label: '' },
        { letter: 'D', label: '' },
        { letter: 'E', label: '' },
        { letter: 'F', label: '' },
        { letter: 'G', label: '' },
        { letter: 'H', label: '' },
        { letter: 'I', label: '' },
      ],
      items: [
        { number: 15, prompt: 'New car park' },
        { number: 16, prompt: 'New cricket pitch' },
        { number: 17, prompt: "Children's playground" },
        { number: 18, prompt: 'Skateboard ramp' },
        { number: 19, prompt: 'Pavilion' },
        { number: 20, prompt: 'Notice board' },
      ],
      answers: { 15: 'C', 16: 'F', 17: 'A', 18: 'I', 19: 'E', 20: 'H' },
    },
  ],
}

// ---------------------------------------------------------------------------
// LISTENING PART 3 — "City bike-sharing schemes"
// ---------------------------------------------------------------------------

export const LISTENING_P3_SECTION: TestSection = {
  id: 'listeningS3',
  label: 'Listening Part 3',
  timeLabel: '15 phút',
  audioSrc: '/audio/test3/part3.mp3',
  totalQuestions: 10,
  groups: [
    {
      kind: 'mcqMulti',
      instruction: 'Questions 21 – 22. Choose TWO letters, A-E.',
      prompt: 'Which TWO benefits of city bike-sharing schemes do the students agree are the most important?',
      options: [
        { letter: 'A', label: 'reducing noise pollution' },
        { letter: 'B', label: 'reducing traffic congestion' },
        { letter: 'C', label: 'improving air quality' },
        { letter: 'D', label: 'encouraging health and fitness' },
        { letter: 'E', label: 'making cycling affordable' },
      ],
      numbers: [21, 22],
      answers: ['B', 'C'],
    },
    {
      kind: 'mcqMulti',
      instruction: 'Questions 23 – 24. Choose TWO letters, A-E.',
      prompt: 'Which TWO things do the students think are necessary for successful bike-sharing schemes?',
      options: [
        { letter: 'A', label: 'Bikes should have a GPS system.' },
        { letter: 'B', label: 'The app should be easy to use.' },
        { letter: 'C', label: 'Public awareness should be raised.' },
        { letter: 'D', label: 'Only one scheme should be available.' },
        { letter: 'E', label: 'There should be a large network of cycle lanes.' },
      ],
      numbers: [23, 24],
      answers: ['B', 'C'],
    },
    {
      kind: 'matching',
      title: 'Questions 25 – 30',
      instruction:
        "What is the speakers' opinion of the bike-sharing schemes in each of the following cities? Choose SIX answers from the box.",
      optionsTitle: 'Opinion of bike-sharing scheme',
      picker: 'dropdown',
      options: [
        { letter: 'A', label: 'They agree it has been disappointing.' },
        { letter: 'B', label: 'They think it should be cheaper.' },
        { letter: 'C', label: 'They are surprised it has been so successful.' },
        { letter: 'D', label: 'They agree that more investment is required.' },
        { letter: 'E', label: 'They think the system has been well designed.' },
        { letter: 'F', label: 'They disagree about the reasons for its success.' },
        { letter: 'G', label: 'They think it has expanded too quickly.' },
      ],
      items: [
        { number: 25, prompt: 'Amsterdam' },
        { number: 26, prompt: 'Dublin' },
        { number: 27, prompt: 'London' },
        { number: 28, prompt: 'Buenos Aires' },
        { number: 29, prompt: 'New York' },
        { number: 30, prompt: 'Sydney' },
      ],
      answers: { 25: 'C', 26: 'F', 27: 'D', 28: 'E', 29: 'B', 30: 'A' },
    },
  ],
}

// ---------------------------------------------------------------------------
// LISTENING PART 4 — "The extinction of the dodo bird"
// ---------------------------------------------------------------------------

export const LISTENING_P4_SECTION: TestSection = {
  id: 'listeningS4',
  label: 'Listening Part 4',
  timeLabel: '15 phút',
  audioSrc: '/audio/test3/part4.mp3',
  totalQuestions: 10,
  groups: [
    {
      kind: 'fill',
      title: 'The extinction of the dodo bird',
      instruction: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
      blocks: [
        [text('The dodo was a large flightless bird which used to inhabit the island of Mauritius.')],
        [text('History')],
        [
          text('•  1507 – Portuguese ships transporting '),
          blank(31),
          text(' stopped at the island to collect food and water.'),
        ],
        [text('•  1638 – The Dutch established a '), blank(32), text(' on the island.')],
        [text('•  They killed the dodo birds for their meat.')],
        [text('•  The last one was killed in 1681.')],
        [text('Description')],
        [text('•  The only record we have is written descriptions and pictures (possibly unreliable).')],
        [text('•  A Dutch painting suggests the dodo was very '), blank(33), text('.')],
        [text('•  The only remaining soft tissue is a dried '), blank(34), text('.')],
        [text('•  Recent studies of a dodo skeleton suggest the birds were capable of rapid '), blank(35), text('.')],
        [text("•  It's thought they were able to use their small wings to maintain "), blank(36), text('.')],
        [text('•  Their '), blank(37), text(' was of average size.')],
        [text('•  Their sense of '), blank(38), text(' enabled them to find food.')],
        [text('Reasons for extinction')],
        [text('•  Hunting was probably not the main cause.')],
        [text('•  Sailors brought dogs and monkeys.')],
        [blank(39), text(" also escaped onto the island and ate the birds' eggs.")],
        [text('•  The arrival of farming meant the '), blank(40), text(' was destroyed.')],
      ],
      answers: {
        31: ['spices'],
        32: ['colony'],
        33: ['fat'],
        34: ['head'],
        35: ['movement'],
        36: ['balance'],
        37: ['brain'],
        38: ['smell'],
        39: ['rats'],
        40: ['forest'],
      },
    },
  ],
}

export const TEST3_SECTIONS: Record<string, TestSection> = {
  readingP1: READING_P1_SECTION,
  readingP2: READING_P2_SECTION,
  readingP3: READING_P3_SECTION,
  listeningS1: LISTENING_P1_SECTION,
  listeningS2: LISTENING_P2_SECTION,
  listeningS3: LISTENING_P3_SECTION,
  listeningS4: LISTENING_P4_SECTION,
}
