// Nội dung đề Test 2 (Reading + Listening S1 + S2) — trích từ "test 2.docx"
// Đáp án Reading Q9-13 (matching) KHÔNG có sẵn trong tài liệu gốc — được suy ra
// từ nội dung bài đọc, cần Long xác nhận lại trước khi dùng làm đáp án chính thức.

export interface TextPart {
  type: 'text'
  value: string
}

export interface BlankPart {
  type: 'blank'
  number: number
}

export type FillPart = TextPart | BlankPart

export interface WordBankOption {
  letter: string
  label: string
}

export interface FillBlankGroup {
  kind: 'fill'
  instruction: string
  title?: string
  blocks: FillPart[][] // mỗi phần tử = 1 dòng/đoạn
  answers: Record<number, string[]> // các đáp án được chấp nhận (so sánh không phân biệt hoa/thường)
  imageSrc?: string // sơ đồ/hình minh họa hiển thị phía trên (VD: diagram labelling)
  imageAlt?: string
  asLines?: boolean // ghi đè cách canh khoảng cách dòng mặc định theo section
  wordBank?: WordBankOption[] // nếu có, mỗi ô trống hiển thị dạng dropdown chọn từ danh sách này thay vì gõ tự do
}

export interface MatchingOption {
  letter: string
  label: string
}

export interface MatchingItem {
  number: number
  prompt: string
}

export interface MatchingGroup {
  kind: 'matching'
  instruction: string
  title?: string
  optionsTitle: string
  options: MatchingOption[]
  items: MatchingItem[]
  answers: Record<number, string>
  optionsImage?: string // nếu có, hiển thị ảnh (VD: bản đồ) thay cho danh sách chữ options
  picker?: 'buttons' | 'dropdown' | 'grid' // 'dropdown': nhiều lựa chọn dài (VD: heading i-viii); 'grid': bảng ô tròn chọn nhanh (VD: bản đồ)
  layout?: 'stacked' | 'split' // 'split' = ghim options/ảnh 1 bên, câu hỏi 1 bên trên màn hình rộng
}

export interface McqOption {
  letter: string
  label: string
}

export interface McqItem {
  number: number
  prompt: string
  options: McqOption[]
}

export interface McqGroup {
  kind: 'mcq'
  instruction: string
  title?: string
  items: McqItem[]
  answers: Record<number, string>
}

export interface McqMultiOption {
  letter: string
  label: string
}

// Dạng "Choose TWO letters" — 1 nhóm câu hỏi dùng chung 1 danh sách lựa chọn,
// học sinh chọn đúng 2 trong số các lựa chọn cho 2 số câu hỏi liên tiếp.
export interface McqMultiGroup {
  kind: 'mcqMulti'
  instruction: string
  prompt: string
  options: McqMultiOption[]
  numbers: [number, number]
  answers: string[] // đúng 2 chữ cái đúng, thứ tự không quan trọng
}

export type QuestionGroup = FillBlankGroup | MatchingGroup | McqGroup | McqMultiGroup

export interface TestSection {
  id: string
  label: string
  timeLabel: string
  passageTitle?: string
  passageParagraphs?: string[]
  audioSrc?: string
  totalQuestions: number
  groups: QuestionGroup[]
}

export function text(value: string): TextPart {
  return { type: 'text', value }
}
export function blank(number: number): BlankPart {
  return { type: 'blank', number }
}

// ---------------------------------------------------------------------------
// READING — "Tribal tourism" (Complete IELTS 4.0-5.0 — Holidays with a difference)
// ---------------------------------------------------------------------------

export const READING_SECTION: TestSection = {
  id: 'reading',
  label: 'Reading',
  timeLabel: '20 phút',
  passageTitle: '[Complete IELTS 4.0 - 5.0] - Holidays with a difference',
  passageParagraphs: [
    'Tribal tourism is becoming more popular. But at what cost to the locals?',
    'Tribal tourism is a relatively new type of tourism. It involves travellers going to remote destinations, staying with local people and learning about their culture and way of life. They stay in local accommodation, share facilities with local people, and join in with meals and celebrations. At the moment, less than one percent of holidays are tribal tourism holidays, but this is set to change.',
    'Tribal tourism is often compared with foreign exchange visits. However, a foreign exchange involves staying with people who often share the same values. Tribal tourism takes visitors to places where the lifestyle is very different from that in their home location. Those who have been on a tribal holiday explain that experiencing this lifestyle is the main attraction. They say that it offers them the chance to live in a way they never have before.',
    'Not everyone is convinced that tribal tourism is a good thing, and opinions are divided. The argument is about whether or not it helps the local population, or whether it exploits them. The main problem is that, because tribal tourism is relatively new, the long-term effects on local populations have not been studied in much detail. Where studies have been carried out, the effects have been found to be negative.',
    "Travel writer Ian Coleman recalls a recent trip to Guatemala, where he saw an example of this. 'There is a village with a statue of a man called Maximon, who has a special spiritual meaning for the local tribe,' he says. 'The statue is kept indoors, and once a year the locals bring him out and carry him around the village. However, visitors now pay money for them to bring the statue out and carry it around, while they take photographs. As a result, Maximon has lost his original meaning, and is now just another tourist attraction.'",
    "So, is it possible to experience an exotic culture without harming it in some way? 'With a bit of thought, we can maximise the positive impacts and minimise the negative,' says travel company director Hilary Waterhouse. 'Remember that you are there not only to experience a different culture, but to help it in some way. Tourists bring money to the community, which the community can invest in local projects. However, this does not mean you can act the way you might do back home. The most important thing is to show respect, learn about, and be aware of local customs and traditions. Always remember you're a guest.'",
    "Dawn Baker, manager of travel company Footprints, runs tours to tribal areas in Peru. 'Good companies specialising in tribal tours are very careful about who they allow on their tours,' she says. 'They won't take anyone they feel is unsuitable.' Baker offers reading recommendations so that visitors can read about the country and its cultures. 'The rewards of a trip to this country are priceless, and the more you know in advance, the more priceless they are.'",
    "Tribal tourism travellers are often surprised at how basic their facilities are when they get there. 'It's not for everyone, but for me it was all part of the experience,' says Jamie White, who has recently returned from a trip to Borneo. 'We stayed in the same huts that everyone was living in, with no running water and no electricity. It was basic, but it was an ethical way to travel. Being comfortable means you use more local resources and so have more of an environmental impact.'",
  ],
  totalQuestions: 13,
  groups: [
    {
      kind: 'fill',
      title: 'Questions 1 – 8',
      instruction:
        'Complete the summary below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.',
      blocks: [
        [
          text('Tribal tourism'),
        ],
        [
          text('People who take a tribal tourism holiday visit places that are '),
          blank(1),
          text('. When they are there, they find out about the local '),
          blank(2),
          text(' and how people live. Currently, tribal tourism accounts for less than '),
          blank(3),
          text(' of the tourism industry. Tribal tourism holidays are different from foreign exchange visits because the travellers and the people they meet have different '),
          blank(4),
          text('. Tribal tourism travellers experience a '),
          blank(5),
          text(' that they are not familiar with. For them, this is its '),
          blank(6),
          text('. However, some people argue that '),
          blank(7),
          text(' do not benefit from this kind of tourism. '),
          blank(8),
          text(' show that the effects of tribal tourism are not good.'),
        ],
      ],
      answers: {
        1: ['remote'],
        2: ['culture'],
        3: ['1 percent', 'one percent', '1%'],
        4: ['values'],
        5: ['lifestyle'],
        6: ['main attraction'],
        7: ['local populations', 'local population'],
        8: ['studies'],
      },
    },
    {
      kind: 'matching',
      instruction:
        'Match each statement with the correct person, A-B-C-D. NB You may use any letter more than once.',
      optionsTitle: 'List of people',
      options: [
        { letter: 'A', label: 'Ian Coleman' },
        { letter: 'B', label: 'Hilary Waterhouse' },
        { letter: 'C', label: 'Dawn Baker' },
        { letter: 'D', label: 'Jamie White' },
      ],
      items: [
        { number: 9, prompt: 'Travellers may need to change the way they behave.' },
        { number: 10, prompt: 'Some travellers would not enjoy living the way that the local people do.' },
        { number: 11, prompt: 'Tribal tourism can have benefits for local people.' },
        { number: 12, prompt: 'Some travellers make local people do things that they would not normally do.' },
        { number: 13, prompt: 'Learning about a place before you go there makes your trip much more satisfying.' },
      ],
      // ⚠️ Suy ra từ nội dung bài đọc — tài liệu gốc không có đáp án chính thức cho Q9-13, cần Long xác nhận lại.
      answers: {
        9: 'B',
        10: 'D',
        11: 'B',
        12: 'A',
        13: 'C',
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// LISTENING SECTION 1 — "Oz Housesitters" (form completion)
// ---------------------------------------------------------------------------

export const LISTENING_S1_SECTION: TestSection = {
  id: 'listeningS1',
  label: 'Listening Section 1',
  timeLabel: '15 phút',
  audioSrc: '/audio/test2/section1.mp3',
  totalQuestions: 10,
  groups: [
    {
      kind: 'fill',
      instruction: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      title: 'Housesitter Registration Form',
      blocks: [
        [text('Name: '), text('Jenny Hall')],
        [text('Address: 14 '), blank(1), text(' St, Greenfield')],
        [text('Mobile no: '), blank(2)],
        [text('Date required from: '), blank(3)],
        [text('Length of time required: '), blank(4), text(' weeks')],
        [text('House features:')],
        [text('— it has a new '), blank(5)],
        [text('— it is near a station')],
        [text("— there is room for the housesitter's "), blank(6)],
        [text('Special duties required:')],
        [text('— water the '), blank(7), text(' tree')],
        [text('Housesitter requirements:')],
        [text('— the house is large so a '), blank(8), text(' is preferred')],
        [text('— no '), blank(9), text(' allowed')],
        [text('— would like a check carried out by the '), blank(10)],
      ],
      answers: {
        1: ['gray', 'grey'],
        2: ['04915777248'],
        3: ['29th september', '29 september', 'september 29th', 'september 29'],
        4: ['3', 'three'],
        5: ['pool'],
        6: ['transport', 'car'],
        7: ['lemon'],
        8: ['couple'],
        9: ['smoking'],
        10: ['police'],
      },
    },
  ],
}

// ---------------------------------------------------------------------------
// LISTENING SECTION 2 — "Working for Johnson Jones"
// ---------------------------------------------------------------------------

export const LISTENING_S2_SECTION: TestSection = {
  id: 'listeningS2',
  label: 'Listening Section 2',
  timeLabel: '15 phút',
  audioSrc: '/audio/test2/section2.mp3',
  totalQuestions: 10,
  groups: [
    {
      kind: 'mcq',
      instruction: 'Questions 1 – 5. Choose the correct letter, A, B or C.',
      items: [
        {
          number: 1,
          prompt: 'What does Mark say first attracts people to working for Johnson Jones?',
          options: [
            { letter: 'A', label: 'the pay' },
            { letter: 'B', label: 'the staff discount' },
            { letter: 'C', label: 'the working hours' },
          ],
        },
        {
          number: 2,
          prompt: "Mark says the company is one of the country's most successful retailers because it",
          options: [
            { letter: 'A', label: 'is focused on long-term planning.' },
            { letter: 'B', label: 'provides excellent customer service.' },
            { letter: 'C', label: 'offers value for money.' },
          ],
        },
        {
          number: 3,
          prompt: 'Mark says that because Johnson Jones is a partnership, the staff',
          options: [
            { letter: 'A', label: 'are better trained.' },
            { letter: 'B', label: 'have better job security.' },
            { letter: 'C', label: 'are given more responsibility.' },
          ],
        },
        {
          number: 4,
          prompt: 'What is the typical annual bonus that partners receive?',
          options: [
            { letter: 'A', label: '8%' },
            { letter: 'B', label: '15%' },
            { letter: 'C', label: '20%' },
          ],
        },
        {
          number: 5,
          prompt: 'To qualify for the leisure and holiday facilities, partners must have worked for the company for',
          options: [
            { letter: 'A', label: 'one year.' },
            { letter: 'B', label: 'six months.' },
            { letter: 'C', label: 'three months.' },
          ],
        },
      ],
      answers: { 1: 'B', 2: 'A', 3: 'C', 4: 'B', 5: 'C' },
    },
    {
      kind: 'matching',
      instruction: 'Questions 6 – 10. What information is given about each of the following staff holiday centres?',
      optionsTitle: 'List of options',
      options: [
        { letter: 'A', label: 'available for celebrations and parties' },
        { letter: 'B', label: 'suitable for families with children' },
        { letter: 'C', label: 'regularly used by senior management' },
        { letter: 'D', label: "also supplies food to the company's supermarkets" },
        { letter: 'E', label: 'spa facilities available' },
        { letter: 'F', label: 'similar to being in someone\'s home' },
        { letter: 'G', label: 'good for short breaks' },
      ],
      items: [
        { number: 6, prompt: 'The Grange' },
        { number: 7, prompt: 'Meadow House' },
        { number: 8, prompt: 'Coombe Manor' },
        { number: 9, prompt: 'The Barn' },
        { number: 10, prompt: 'The Stable' },
      ],
      answers: { 6: 'C', 7: 'F', 8: 'B', 9: 'A', 10: 'G' },
    },
  ],
}

export const TEST2_SECTIONS: Record<TestSection['id'], TestSection> = {
  reading: READING_SECTION,
  listeningS1: LISTENING_S1_SECTION,
  listeningS2: LISTENING_S2_SECTION,
}
