import fs from 'node:fs'
import pg from 'pg'

const { Client } = pg

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8')
    .split(/\n/)
    .filter((line) => line && !line.trim().startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator), line.slice(separator + 1)]
    })
)

const projects = [
  {
    slug: 'arfa-global-group',
    en: {
      name: 'ARFA GLOBAL GROUP',
      subtitle: 'Brand identity',
      description_text: 'Identity for ARFA Global Group LTD, an international consulting company that builds lasting ties between Russian business and the countries of the Middle East.',
      concept_text: "The company's mark is made from the first letter of its name and is shaped like a bridge, the one ARFA builds between Russian business and the countries of the Middle East, opening new opportunities for business and humanitarian cooperation. The three parts of the mark stand for culture, economy and technology, brought together in the company's projects.",
      requirements_text: 'The company works with the support of state bodies and public institutions, and its clients are large firms in energy, construction, medicine and other fields. The identity had to reflect this level of trust: to look strict and corporate and to be equally clear to partners in Russia and in the Middle East.',
      output_text: 'The signature device of ARFA is a geometric pattern created from the logo mark. The standing of the clients and work at an international level called for impeccable print quality. The materials were handed to clients as a set, so for a perfect match of shades we took designer paper dyed in the mass and printed with Pantone inks only. Silver ink and clear varnish were used for small accents. The first task after the style was approved was a visual strategy for social media, which launched the advertising campaign for the ARFA Bahrain-2025 forum.\nProject duration: 26 working days.',
      second_block_title: 'An invitation to Bahrain',
      second_block_text: 'The advertising campaign for the forum began in October. Together with a marketing specialist we created content for four platforms (Instagram, Facebook, Telegram, LinkedIn): we introduced the audience to the nuances of doing business in Bahrain and told them about the forum programme and the invited speakers. In November a gala presentation of the ARFA Bahrain-2025 project was held for guests and investors.',
    },
    ru: {
      name: 'ARFA GLOBAL GROUP',
      subtitle: 'Айдентика',
      description_text: 'Айдентика для ARFA Global Group LTD — международной консалтинговой компании, которая выстраивает устойчивые связи между российским бизнесом и странами Ближнего Востока.',
      concept_text: 'Знак компании создан из первой буквы названия и по форме напоминает мост, который ARFA выстраивает между российским бизнесом и странами Ближнего Востока, открывая новые возможности для делового и гуманитарного сотрудничества. Три части знака символизируют культуру, экономику и технологии, соединённые в проектах компании.',
      requirements_text: 'Компания работает при поддержке государственных структур и общественных институтов, а клиентами являются крупные фирмы из сфер энергетики, строительства, медицины и других. Айдентика должна была отразить этот уровень доверия: выглядеть строго и корпоративно и быть одинаково понятной партнёрам в России и на Ближнем Востоке.',
      output_text: 'Фирменным приёмом ARFA стал геометрический паттерн, созданный из знака логотипа. Статус клиентов и работа на международном уровне требовали безупречного качества печати. Материалы передавались клиентам набором, поэтому для полного совпадения оттенков мы взяли дизайнерскую бумагу, окрашенную в массе, и для печати выбирали только краски Pantone. Для небольших акцентов использовались серебряная краска и прозрачный лак. Первой задачей после согласования стилистики стала визуальная стратегия для социальных сетей, с которой началась рекламная кампания форума ARFA Bahrain-2025.\nСрок работы: 26 рабочих дней.',
      second_block_title: 'Приглашение в Бахрейн',
      second_block_text: 'Рекламная кампания для форума началась в октябре. Совместно с маркетологом мы создавали контент для 4 площадок (Instagram, Facebook, Telegram, LinkedIn): знакомили аудиторию с нюансами ведения бизнеса в Бахрейне, рассказывали про программу форума и приглашённых спикеров. Для гостей и инвесторов в ноябре была проведена торжественная презентация проекта ARFA Bahrain-2025.',
    },
  },
  {
    slug: 'sapfir',
    en: {
      name: 'SAPFIR', subtitle: 'Brand identity',
      description_text: 'Identity for the SAPFIR project office. The team is based at the Skolkovo Foundation and acts as an agency for the development of science in the field of artificial intelligence, with the support of the Government of the Russian Federation.',
      concept_text: "The identity is built around a single metaphor: structured light. Sapphire, the mineral that shares the office's name, transmits light differently depending on how it is cut, and the team works in a similar way: it passes a large flow of information through itself, filters it and gives it structure. The metaphor is broken down into simple images: rays, contrasting gradients and overlays of translucent layers. The mark repeats the crystal lattice of the mineral, and the rays from its faces meet at the centre, where information acquires meaning.",
      requirements_text: 'The project office was established recently and needed a visual image of its own. The task was to show artificial intelligence in an untypical way, without robots or neural networks, and to combine the seriousness of a state structure with the drive of a young team. The style had to work in corporate presentations, in analytical reports and journals, and on corporate and event merchandise.',
      output_text: 'The logo system carries the name in Russian and in English and suits both work in the CIS countries and international exhibitions and conferences. All elements of the identity were chosen so that it can produce a strict visual as well as more creative solutions: the choice depends on the audience and the place of use. The first materials on which the visual identity was built were corporate presentation templates, booklets and analytical reports: the basic tools for the first communication campaigns of the SAPFIR team. Project duration: 60 working days.',
      second_block_title: 'Templates for any occasion',
      second_block_text: "Corporate presentations remain the team's main working tool. Around sixty template slides in PowerPoint, Keynote and Figma let employees assemble materials in a single style on their own, on any device they find convenient. Each file has the corporate colour palette, the modular grid and a guide to working with the typefaces built in.",
    },
    ru: {
      name: 'САПФИР', subtitle: 'Айдентика',
      description_text: 'Айдентика для проектного офиса САПФИР. Команда работает на базе Фонда «Сколково» и выполняет агентские функции по развитию науки в области искусственного интеллекта при поддержке Правительства РФ.',
      concept_text: 'Айдентика выстроена вокруг одной метафоры — структурированного света. Одноимённый минерал сапфир по-разному пропускает свет в зависимости от огранки, и команда проектного офиса работает похожим образом: пропускает через себя большой поток информации, фильтрует и структурирует его. Метафора разложена на простые образы: лучи, контрастные градиенты и наложения полупрозрачных слоёв. Знак повторяет кристаллическую решётку минерала, лучи от его граней сходятся в центре, где информация обретает смысл.',
      requirements_text: 'Проектный офис появился недавно, и ему нужен был собственный визуальный облик. Задача состояла в том, чтобы показать искусственный интеллект нетипично, без роботов и нейронных сетей, и соединить серьёзность государственной структуры с драйвом молодой команды. Стилистика должна была работать на корпоративных презентациях, в аналитических отчётах и журналах, на корпоративном и событийном мерче.',
      output_text: 'Система логотипов содержит название на русском и английском языках и подходит как для работы в странах СНГ, так и для международных выставок и конференций. Все элементы фирменного стиля подобраны так, чтобы создавать и строгий визуал, и более креативные решения: выбор зависит от аудитории и места использования. Первыми материалами, на основе которых была создана визуальная идентичность, стали шаблоны корпоративных презентаций, буклеты и аналитические отчёты: основные инструменты для первых коммуникационных кампаний команды САПФИР. Срок работы: 60 рабочих дней.',
      second_block_title: 'Шаблоны на любой случай',
      second_block_text: 'Корпоративные презентации остаются главным рабочим инструментом команды. Около шестидесяти шаблонных слайдов в PowerPoint, Keynote и Figma позволяют сотрудникам самостоятельно собирать материалы в едином стиле на любом удобном устройстве. В каждый файл внедрены корпоративная цветовая палитра, модульная сетка и инструкция по работе со шрифтами.',
    },
  },
  {
    slug: 'catch-the-brand',
    en: {
      name: 'CATCH THE BRAND', subtitle: 'Social media design',
      description_text: 'Social media design for Catch.the.Brand (CTB), a private concierge service that works by personal invitation only.',
      concept_text: 'The visual language is built on attention to detail, just as the service itself is. A bright orange serves as the colour accent of the feed, while neutral shades add "air" and keep its elegant, exclusive character. Handwritten notes, arrows and rounded forms give the brand individuality and movement and create the feeling of a personal, comfortable service. The brand mark is a cat, a symbol of grace and mystery: it stands for the inaccessibility of the pieces the service finds for its clients.',
      requirements_text: "The Catch.the.Brand team gives its clients the opportunity to acquire the most desirable pieces from the catalogues of the world's fashion leaders. The company's main value is a satisfied client: at every stage they receive a high level of service and an individual approach to any request. Its social media needed a system that would show this exclusivity and at the same time lead a client towards an order.",
      output_text: 'The profile is designed to lead a client from interest to purchase: the highlights explain the service, ordering, payment, delivery and sizing. The content is organised into rubrics. Stories about how pieces are made bring followers back to the page, selections with prices make choosing easier, and candid shots from boutiques and fitting rooms, taken on a phone, create a sense of access behind closed doors. Stickers mark the recurring rubrics in stories and reels. Project duration: 45 working days.',
      second_block_title: 'To catch the unattainable',
      second_block_text: "The silhouette of a cat was chosen as the brand mark. The grace and mystery of the animal convey the character of the pieces from closed collections that the service's clients come for. The cat remains a hunter all the same, and the name Catch.the.Brand finds its literal continuation in the mark: a precise, elegant leap for the coveted prey.",
    },
    ru: {
      name: 'CATCH THE BRAND', subtitle: 'Дизайн социальных сетей',
      description_text: 'Дизайн социальных сетей для Catch.the.Brand (CTB) — закрытого консьерж-сервиса, который работает только по личному приглашению.',
      concept_text: 'Визуальный язык строится на внимании к деталям — так же, как сам сервис. Яркий оранжевый служит цветовым акцентом ленты, а нейтральные оттенки добавляют в неё «воздуха» и сохраняют элегантный, эксклюзивный характер. Рукописные пометки, стрелки и скруглённые формы придают бренду индивидуальность и динамику и создают ощущение личного, удобного сервиса. Знак бренда — кошка, символ изящества и загадочности: она олицетворяет недоступность вещей, которые сервис находит для своих клиентов.',
      requirements_text: 'Команда Catch.the.Brand даёт клиентам возможность приобрести самые желанные позиции из каталогов мировых лидеров моды. Главная ценность компании — довольные клиенты: на каждом этапе они получают сервис высокого уровня и индивидуальный подход к любой задаче. Социальным сетям нужна была система, которая показывает эту эксклюзивность и одновременно ведёт клиента к заказу.',
      output_text: 'Профиль оформлен так, чтобы вести клиента от интереса к покупке: актуальные истории рассказывают о сервисе, заказе, оплате, доставке и размерах. Контент выстроен по рубрикам. Истории создания вещей возвращают подписчиков на страницу, подборки с ценами упрощают выбор, а «живые» кадры из бутиков и примерочных, снятые на телефон, создают ощущение доступа за закрытые двери. Стикеры отмечают повторяющиеся рубрики в сторис и рилс. Срок работы: 45 рабочих дней.',
      second_block_title: 'Поймать недоступное',
      second_block_text: 'В качестве знака бренда был выбран силуэт кошки. Изящество и загадочность животного передают характер вещей из закрытых коллекций, за которыми приходят клиенты сервиса. Кошка при этом остаётся охотницей, и название Catch.the.Brand получает буквальное продолжение в знаке: точный, элегантный бросок за желанной добычей.',
    },
  },
  {
    slug: 'geisha',
    en: {
      name: 'GEISHA', subtitle: 'Brand identity',
      description_text: 'Comprehensive brand identity for GEISHA, a beauty studio and school for makeup artists.',
      concept_text: 'The identity unites Japanese aesthetics with a professional beauty service. The logo is a graphic interpretation of a fan, set with geometric typography. A deep red, with its symbolism of the rising sun, is complemented by cream accents, and the graphics are built on patterned textures drawn from Japanese fabrics.',
      requirements_text: 'GEISHA is a studio inspired by the art of the geisha, where clients immerse themselves in the traditions of Japanese care. The identity had to visually separate it from standard "beauty salons", to emphasise its educational side, the school, and to keep a balance between the exotic and a luxury service.',
      output_text: 'The system extends across a wide range of media, from cosmetic bags to banners, all united by a single system of illustrations. Every element contributes to a tactile experience: the embossed paper of the gift book and the silk-screen printing on the packaging. The project was taken through to production-ready artwork: sizes, materials and printing methods were defined for each item, and the studio received a set ready to go to the printer. Project duration: 35 working days.',
      second_block_title: 'The fish that becomes a dragon',
      second_block_text: 'The fan in the mark carries two koi fish. In a Japanese legend a small fish overcomes every obstacle and turns into a dragon. This is how the mark speaks about the school: learning new techniques begins with difficulties, yet the students of Geisha see it through and become sought-after professionals.',
    },
    ru: {
      name: 'GEISHA', subtitle: 'Айдентика',
      description_text: 'Комплексная айдентика для GEISHA — студии красоты и школы визажистов.',
      concept_text: 'Айдентика объединяет японскую эстетику с профессиональным бьюти-сервисом. Логотип — графическая интерпретация веера в сочетании с геометричной типографикой. Глубокий красный с его символикой восходящего солнца дополнен кремовыми акцентами, а графика построена на узорных текстурах, взятых из японских тканей.',
      requirements_text: 'GEISHA — студия, вдохновлённая искусством гейш, где клиенты погружаются в традиции японского ухода. Айдентика должна была визуально отделить её от стандартных «салонов красоты», подчеркнуть образовательную составляющую — школу — и сохранить баланс между экзотикой и люксовым сервисом.',
      output_text: 'Система охватывает широкий круг носителей, от косметичек до баннеров, и все они объединены единой системой иллюстраций. Каждый элемент работает на тактильный опыт: тиснёная бумага подарочной книги, шелкография на упаковке. Проект доведён до производственных макетов: для каждого носителя определены размеры, материалы и способ печати, и студия получила комплект, готовый к передаче в типографию. Срок работы: 35 рабочих дней.',
      second_block_title: 'Рыбка, которая становится драконом',
      second_block_text: 'На веере в знаке изображены две рыбки кои. По японской легенде маленькая рыбка, преодолев все препятствия, превращается в дракона. Так знак рассказывает о школе: освоение новых техник начинается с трудностей, но ученики Geisha доводят дело до конца и становятся востребованными мастерами.',
    },
  },
  {
    slug: 'nicholas-efimtsev',
    en: {
      name: 'NICHOLAS EFIMTSEV', subtitle: 'Brand identity',
      description_text: 'Brand identity for Nicholas Efimtsev, a Parisian photographer whose artistic approach is marked by subtle sensuality and plasticity.',
      concept_text: 'The identity reflects a balance between academic rigour and sensual aesthetics. A monochrome base is paired with an accent red that symbolises passion, and the logo carries a reference to vintage photographic film. The system adapts to its context: a strict version for the website and a bolder one for social media.',
      requirements_text: 'Nicholas is a photographer with a background in economics, inspired by Man Ray and the classics of sensual photography. He needed a visual language that would bring together the restraint of the European classical tradition, a hint of sensuality conveyed through details, and functionality across digital and print media.',
      output_text: "The logo is a variable mark with two forms, a wordmark and a graphic version, which works both on the website and on social media. The type pairings and the signature layout are restrained, with a great deal of free space, so that nothing competes with the photographs. The printed part was taken through to production-ready artwork: business cards and certificates were prepared for printing abroad, with selected paper stocks and finishing methods. Today the identity is in use on the photographer's website, on his social media and on his certificates. Project duration: 13 working days.",
      second_block_title: 'Instead of loud words',
      second_block_text: "The printed materials for Nicholas were created with the emphasis on tactile feeling, and the picture came second. The text layout is unconventional and leaves plenty of \"air\" on every item, while heavy cotton paper and the blind-embossed logo add relief and texture to it. This approach strengthens the perception of the photographer's work and makes his images the main accent.",
    },
    ru: {
      name: 'NICHOLAS EFIMTSEV', subtitle: 'Айдентика',
      description_text: 'Айдентика для Николая Ефимцева — парижского фотографа, чей художественный метод отличают тонкая чувственность и пластика.',
      concept_text: 'Айдентика отражает баланс между академической строгостью и чувственной эстетикой. Монохромная база дополнена акцентным красным, символизирующим страсть, а логотип отсылает к винтажной фотоплёнке. Система адаптируется под контекст: строгий вариант для сайта и более смелый для социальных сетей.',
      requirements_text: 'Николай — фотограф с экономическим образованием, вдохновлённый Ман Рэем и классиками чувственной фотографии. Ему нужен был визуальный язык, соединяющий сдержанность европейской классики, намёк на чувственность через детали и функциональность для цифровых и печатных носителей.',
      output_text: 'Логотип — вариативный знак в двух формах, словесной и графической, который работает и на сайте, и в социальных сетях. Шрифтовые пары и фирменная вёрстка выстроены сдержанно, с большим количеством свободного пространства, чтобы ничто не спорило с фотографиями. Печатная часть доведена до производственных макетов: визитки и сертификаты подготовлены к печати на зарубежном производстве, с подобранными сортами бумаги и способами нанесения. Сегодня айдентика используется на сайте фотографа, в его социальных сетях и на сертификатах. Срок работы: 13 рабочих дней.',
      second_block_title: 'Вместо громких слов',
      second_block_text: 'Печатные материалы для Николая создавались с упором на тактильные ощущения, а не на картинку. Вёрстка текста нестандартная, при этом с большим количеством «воздуха» на каждом носителе, плотная хлопковая бумага и конгревное тиснение логотипа дополняют её рельефом и фактурой. Такой подход усиливает восприятие творчества фотографа и делает его снимки главным акцентом.',
    },
  },
  {
    slug: 'slottim',
    en: {
      name: 'SLOTTIM', subtitle: 'Packaging design',
      description_text: 'Packaging system for Slottim, a brand of evening bandage dresses sold on a marketplace.',
      concept_text: 'A bandage dress follows the lines of the body, and the packaging speaks the same language. The system is built on an aesthetic of "expensive femininity": soft forms in the die-cut tags, female silhouettes in the brand mark, and the deep range of the main tones in the brand palette. Each element adds to the sense of sensuality and refinement at the moment of unboxing.',
      requirements_text: 'Slottim needed a packaging system for its bandage dresses. The task was to create a tactile, memorable unboxing experience for a brand aimed at affluent women aged 30 to 45, and to convey sensuality and refinement within a strict budget of less than 120 roubles per unit.',
      output_text: "Packaging is the customer's first physical contact with the brand, so the work centred on the sensory side: how a tag, a postcard and a bag feel in the hands. To achieve an expensive tactile impression without exceeding the budget, a material and a printing technology were chosen for each element: textured paper, cardstock of different densities, die-cutting. The set is completed by wet wipes with an antistatic effect and a multi-level system of size and image tags. The project was taken through to production-ready artwork and is designed for runs of 50,000 units and more. The result is a structured packaging system, which is uncommon for most marketplace sellers. Project duration: 47 working days.",
      second_block_title: 'Letters tailored to the figure',
      second_block_text: "The brand's evening dresses are known for their sculpting shape. We carried this metaphor from the image into the typography and the mark: the letters of the name flow into one another like draped fabric, and the mark repeats a corset silhouette with a soft curve at the waist. Before the first fitting, the logo already shows how the dress will sit on the figure.",
    },
    ru: {
      name: 'SLOTTIM', subtitle: 'Дизайн упаковки',
      description_text: 'Система упаковки для Slottim — бренда вечерних бандажных платьев, который продаётся на маркетплейсе.',
      concept_text: 'Бандажное платье повторяет линии тела, и упаковка говорит тем же языком. В основе системы — эстетика «дорогой женственности»: мягкие формы в контурной резке бирок, женские силуэты в знаке бренда и глубокая гамма основных тонов фирменной палитры. Каждый элемент работает на ощущение чувственности и изысканности в момент распаковки.',
      requirements_text: 'Slottim нужна была система упаковки для бандажных платьев. Задача — создать тактильный, запоминающийся опыт распаковки для бренда, ориентированного на состоятельных женщин 30–45 лет, и передать эстетику чувственности и изысканности в рамках жёсткого бюджета: меньше 120 рублей за единицу.',
      output_text: 'Упаковка — первый физический контакт покупательницы с брендом, поэтому главным в работе была сенсорика: то, как бирка, открытка и пакет ощущаются в руках. Чтобы получить дорогое тактильное впечатление и не выйти за бюджет, под каждый элемент подбирались материал и технология печати: фактурная бумага, картон разной плотности, контурная резка. Комплект дополняют влажные салфетки с антистатическим эффектом и многоуровневая система бирок — размерных и имиджевых. Проект доведён до производственных макетов и рассчитан на тираж от 50 000 единиц. Получилась структурированная система упаковки, нехарактерная для большинства селлеров на маркетплейсах. Срок работы: 47 рабочих дней.',
      second_block_title: 'Буквы, сшитые по фигуре',
      second_block_text: 'Вечерним платьям бренда характерна утягивающая форма. Эту метафору мы переложили из образа в типографику и знак: буквы названия перетекают друг в друга, как струящаяся ткань, а знак повторяет корсетный силуэт с плавным изгибом талии. Логотип ещё до примерки показывает, как платье сядет по фигуре.',
    },
  },
  {
    slug: 'brod-bakery',
    en: {
      name: 'BROD BAKERY', subtitle: 'Social media design',
      description_text: 'Visual strategy for the social media of BROD Bakery, a northern bakery with a touch of Scandinavian style in the town of Zapolyarny.',
      concept_text: 'The visual code is built on Scandinavian simplicity and the warm colour of a setting sun, which brings a feeling of cosiness. It deliberately avoids two stereotypes at once: the "pastry shop" look and the cold, blue-toned "northern" one. The bakery combines a modern approach with a northern identity, and the feed does the same: northern motifs localise the brand and give it a position of its own.',
      requirements_text: 'BROD was founded on a compensation payment from Nornickel. The brand speaks to a family audience of children, young parents and local residents, and puts the emphasis on natural products, a cosy atmosphere and social responsibility. It needed a visual strategy for social media that would reflect this unique character.',
      output_text: 'The content strategy brings together three lines: posts about full-cycle production build trust, "tasty" content stimulates sales, and northern motifs tie the brand to its geography. The logo was adapted in soft forms that keep its link to the North. The result is a unified system of visual communication that sets the bakery apart from local competitors. Project duration: 25 working days.',
      second_block_title: 'A taste that needs no translation',
      second_block_text: 'BROD BAKERY stands six kilometres from the border between Russia and Norway and brings guests from different countries together under one roof. The name is written in Norwegian and keeps a touch of Scandinavian identity, while the outline of a baguette in the first letter of the logo makes it intuitively clear what the company does.',
    },
    ru: {
      name: 'BROD BAKERY', subtitle: 'Дизайн социальных сетей',
      description_text: 'Визуальная стратегия для социальных сетей BROD Bakery — северной пекарни с элементами скандинавского стиля из города Заполярный.',
      concept_text: 'Визуальный код строится на скандинавской простоте и тёплом цвете закатного солнца, который даёт ощущение уюта. Он намеренно уходит сразу от двух стереотипов: «кондитерской» эстетики и холодной «северной» в синих тонах. Пекарня сочетает современный подход с северной идентичностью, и лента делает то же самое: северные мотивы локализуют бренд и дают ему уникальное позиционирование.',
      requirements_text: 'BROD создана на компенсацию от «Норникеля». Бренд ориентирован на семейную аудиторию — детей, молодых родителей, местных жителей — и делает акцент на натуральности продукции, уютной атмосфере и социальной ответственности. Ему нужна была визуальная стратегия для социальных сетей, отражающая этот уникальный характер.',
      output_text: 'Контент-стратегия объединяет три линии: посты о производстве полного цикла укрепляют доверие, «вкусный» контент стимулирует продажи, северные мотивы привязывают бренд к его географии. Логотип адаптирован в мягких формах, сохраняющих связь с Севером. Получилась единая система визуальных коммуникаций, которая отстраивает пекарню от местных конкурентов. Срок работы: 25 рабочих дней.',
      second_block_title: 'Вкус, понятный без перевода',
      second_block_text: 'Пекарня BROD BAKERY находится в шести километрах от границы России и Норвегии, объединяя под своей крышей гостей из разных стран. Название написано на норвежском языке и хранит частичку скандинавской идентичности, при этом очертание багета в первой букве логотипа позволяет интуитивно понять, чем занимается компания.',
    },
  },
  {
    slug: 'vvs-project',
    en: {
      name: 'VVS PROJECT', subtitle: 'Brand identity',
      description_text: 'Logo and visual identity for VVS Project, a personal shopping service for luxury fashion and jewellery.',
      concept_text: "The identity presents the brand as a reliable intermediary between the world's luxury houses and their buyers, combining friendliness with exclusivity. The name is set in a serif typeface that hints at the refinement of the brands the service works with. The mark is a monogram inscribed in an oval: the shape refers to the heritage of fashion houses with a history and speaks of status, tradition and reliability.",
      requirements_text: 'The client is a personal shopping service that offers luxury goods from abroad at competitive prices. It needed a memorable visual image that would strengthen trust and attract its target audience. Demand was already coming through word of mouth, yet the absence of a considered identity stood in the way of scaling. The brief covered the logo and a visual style for digital platforms.',
      output_text: 'The service received a restrained and elegant identity that looks equally confident on the website, on social media, in messaging apps and in print. It is supported by two signature devices. A pattern of monograms serves as a background for posts and stories and carries over to physical packaging. A Sicilian ornament of leaves and mandarins gives the brand a Mediterranean warmth and sets it apart from competitors. Today the identity is in use on the VVS website. Project duration: 15 working days.',
      second_block_title: 'Sicily in the details',
      second_block_text: 'The strict base of the logo is joined by a Sicilian ornament of abstract leaves and mandarins. It recalls the resorts of The White Lotus and brings associations with exclusive leisure and impeccable style. The same character continues in the memory card, a small card of thick stock with a photograph and the name of the piece, enclosed with every order.',
    },
    ru: {
      name: 'VVS PROJECT', subtitle: 'Айдентика',
      description_text: 'Логотип и фирменный стиль для VVS Project — сервиса персонального шопинга люксовой одежды и ювелирных изделий.',
      concept_text: 'Айдентика представляет бренд как надёжного посредника между мировыми люксовыми марками и покупателями, сочетая дружелюбие и эксклюзивность. Название набрано антиквой, которая намекает на утончённость брендов, с которыми работает сервис. Знак — монограмма, вписанная в овал: эта форма отсылает к наследию модных домов с историей и говорит о статусе, традициях и надёжности.',
      requirements_text: 'Клиент — сервис персонального шопинга, который предлагает люксовые товары из-за рубежа по конкурентоспособным ценам. Ему нужен был запоминающийся визуальный образ, чтобы укрепить доверие и привлечь целевую аудиторию. Спрос уже шёл через сарафанное радио, но отсутствие продуманной айдентики мешало масштабированию. В задачу входили логотип и фирменный стиль для цифровых платформ.',
      output_text: 'Сервис получил сдержанный и элегантный фирменный стиль, который одинаково уверенно выглядит на сайте, в социальных сетях, мессенджерах и в печати. Его дополняют два фирменных приёма. Паттерн из монограмм служит подложкой для постов и сторис и переходит на физическую упаковку. Сицилийский орнамент с листьями и мандаринами добавляет бренду средиземноморской теплоты и выделяет его среди конкурентов. Сегодня айдентика работает на сайте VVS. Срок работы: 15 рабочих дней.',
      second_block_title: 'Сицилия в деталях',
      second_block_text: 'Строгую основу логотипа дополняет сицилийский орнамент: абстрактные листья и мандарины. Он отсылает к курортам из сериала «Белый лотос» и вызывает ассоциации с эксклюзивным отдыхом и безупречным стилем. Тот же характер продолжает memory card — небольшая карточка из плотного картона с фотографией и названием вещи, которую вкладывают в заказ.',
    },
  },
]

const textFields = [
  'name',
  'subtitle',
  'description_text',
  'concept_text',
  'requirements_text',
  'output_text',
  'second_block_title',
  'second_block_text',
]

const authoredWrapSettings = Object.fromEntries(
  textFields.map((field) => [field, { mode: 'authored', mobile_text: '' }])
)

const dbUrl = env.SUPABASE_DB_URL
if (!dbUrl || !dbUrl.includes('supabase')) {
  throw new Error('SUPABASE_DB_URL is missing or does not point to Supabase')
}

const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })
const testSlugs = ['project', 'eightprojects', 'eightprojects-1']

try {
  await client.connect()
  await client.query('begin')

  const existingTests = await client.query(
    'select slug from public.projects where slug = any($1::text[]) order by slug',
    [testSlugs]
  )
  if (existingTests.rowCount !== testSlugs.length) {
    throw new Error(`Expected exactly ${testSlugs.length} test projects, found ${existingTests.rowCount}`)
  }

  const adminUsers = await client.query('select id from auth.users order by created_at asc')
  if (adminUsers.rowCount !== 1) {
    throw new Error(`Expected exactly one admin user, found ${adminUsers.rowCount}`)
  }
  const adminUserId = adminUsers.rows[0].id

  await client.query('delete from public.projects where slug = any($1::text[])', [testSlugs])

  for (const [index, project] of projects.entries()) {
    const inserted = await client.query(
      `insert into public.projects (
        slug, name, subtitle, cover_image_url, show_on_home,
        description_text, concept_text, requirements_text, output_text,
        first_horizontal_image_url, second_block_title, second_block_text,
        presentation_url, created_by, created_at, updated_at
      ) values (
        $1, $2, $3, '', $4,
        $5, $6, $7, $8,
        '', $9, $10,
        null, $11, now() - ($12::int * interval '1 second'), now()
      ) returning id`,
      [
        project.slug,
        project.en.name,
        project.en.subtitle,
        index < 3,
        project.en.description_text,
        project.en.concept_text,
        project.en.requirements_text,
        project.en.output_text,
        project.en.second_block_title,
        project.en.second_block_text,
        adminUserId,
        index,
      ]
    )
    const projectId = inserted.rows[0].id

    for (const locale of ['en', 'ru']) {
      const translation = project[locale]
      await client.query(
        `insert into public.project_translations (
          project_id, locale, name, subtitle, description_text, concept_text,
          requirements_text, output_text, second_block_title, second_block_text,
          wrap_settings, created_at, updated_at
        ) values (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11::jsonb, now(), now()
        )`,
        [
          projectId,
          locale,
          translation.name,
          translation.subtitle,
          translation.description_text,
          translation.concept_text,
          translation.requirements_text,
          translation.output_text,
          translation.second_block_title,
          translation.second_block_text,
          JSON.stringify(authoredWrapSettings),
        ]
      )
    }
  }

  const verification = await client.query(
    `select p.slug, p.show_on_home, count(t.locale)::int as locales
     from public.projects p
     left join public.project_translations t on t.project_id = p.id
     group by p.id
     order by p.created_at desc`
  )

  if (verification.rowCount !== projects.length || verification.rows.some((row) => row.locales !== 2)) {
    throw new Error(`Verification failed: ${JSON.stringify(verification.rows)}`)
  }

  await client.query('commit')
  console.log(JSON.stringify(verification.rows, null, 2))
} catch (error) {
  await client.query('rollback').catch(() => {})
  throw error
} finally {
  await client.end()
}
