////////////////////////// CLEAN THIS UGLY CODE UP

/**
 * CUSTOM HIGHSLIDE
 */
/* optionally override the settings at the top of the highslide.js file */
    hs.graphicsDir = '/highslide_graphics/';
    hs.outlineType = 'custom3';
    hs.wrapperClassName = 'draggable-header';
    hs.showCredits = false;
    hs.width = 400; 
    hs.headingEval = 'this.a.name'; 
    hs.minHeight = 400; 
    hs.zIndexCounter = 1300; 


// Manages proper focusing for use with screenreaders. 
hs.Expander.prototype.onAfterExpand = function() {

//if paragraph exists, focus on first paragraph. Else read unformatted text. 
if ($(this.content).find('.highslide-maincontent p').length > 0) {
  var firstparagraph = $(this.content).find('.highslide-maincontent p').get(0); 
  $(firstparagraph).attr('tabindex', -1).focus(); 
} else {
  $(this.content).find('.highslide-maincontent').attr('tabindex', -1).focus(); 
};

//if paragraph exists, focus on first paragraph. Else, read unformatted text.
if ($(this.wrapper).find('.highslide-caption p').length > 0) {
  var captionparagraph = $(this.wrapper).find('.highslide-caption p').get(0); 
  $(captionparagraph).attr('tabindex', -1).focus(); 
} else {
  $(this.wrapper).find('.highslide-caption').attr('tabindex', -1).focus(); 
};

};  

// Returns focus to proper element on close of highslide window. 
hs.Expander.prototype.onAfterClose = function () {
  $(this.a).focus(); 
};



// displays greeting
//window.onload = function () {
//var heading = document.getElementById("start-info"); 
//return hs.htmlExpand(heading, {maincontentId:'start-content', headingText: 'Living Archives on Eugenics - Timeline', width: '350'}); 
//}
//


jQuery(document).ready(function() {


/* this is the JSON object which will contain all of the data for the Heroes/Villains
  modele. It's basically an array of dictionaries. The square bracket represents the 
  array, while the curly bracket denotes the dictionary. 'title' represents the key, while
  'Alexander Graham Bell' represents the value. 

  One weird quirk -- IE 8 doesn't like a trailing comma on the last key/value pair
  of a dictionary. Weird, I know. So you can see that it's omitted after 'category'.

  Another thing -- the imageURL represents the relative URL to the image file. We need to
  select one image size and stick with it. The Bell picture I was using was 183 x 282. 
  But we should probably just round that to an even number. 

  p.s. You can validate JSON here: http://jsonlint.com/

*/
  data = [
{
name: "Alexander Graham Bell",
dates: "1847-1922",
blurb: "Canadian, Inventor of the Telephone",
heroQuote: "A man, as a general rule, owes very little to what he is born with -- a man is what he makes of himself.", 
villainQuote: "We must (1) Determine the causes that promote intermarriages among the deaf and dumb; and (2) remove them.", 
image: "/images/heroes/Bell.jpg",
tags: ["Scientist", "Male"],
description: "Bell was connected with the eugenics movement in the United States. In his lecture Memoir upon the formation of a deaf variety of the human race presented to the National Academy of Sciences on November 13, 1883 he noted that congenitally deaf parents were more likely to produce deaf children and tentatively suggested that couples where both parties were deaf should not marry. However, it was his hobby of livestock breeding which led to his appointment to biologist David Starr Jordan's Committee on Eugenics, under the auspices of the American Breeders Association. The committee unequivocally extended the principle to man. From 1912 until 1918 he was the chairman of the board of scientific advisers to the Eugenics Record Office associated with Cold Spring Harbor Laboratory in New York, and regularly attended meetings. In 1921, he was the honorary president of the Second International Congress of Eugenics held under the auspices of the American Museum of Natural History in New York. Organisations such as these advocated passing laws (with success in some states) that established the compulsory sterilization of people deemed to be, as Bell called them, a 'defective variety of the human race'. By the late 1930s, about half the states in the U.S. had eugenics laws, and California's compulsory sterilization law was used as a model for that of Nazi Germany.",
moreInfo: ["http://en.wikipedia.org/wiki/Alexander_Graham_Bell"]
},
{
name: "Charles Kirk Clarke",
dates: "1857-1924",
blurb: "Psychiatrist, influential in Canadian politics",
heroQuote: "He was one of the pioneers in establishing non-restraint in the treatment of patients [of mental illness], an advocate of occupational therapy for the insane, and [...] fought hard and persistently for [...] patients to be comfortably housed and cared for.", 
villainQuote: "We must control sexual perverts of the most revolting kind, insane criminals, the criminal insane, slum degenerates, general paretics, in fact wealkings of all objectionable types ... as they come from Britain.", 
image: "/images/heroes/CKClarke.jpeg",
tags: ["Doctor", "Male"],
description: "Born in Elora, Ontario, to a former parliamentarian, Clarke went to college at the University of Toronto in 1879. He later went on to found the Canadian National Committee for Mental Hygiene (now the Canadian Mental Health Association) in 1914 with Dr. Clarence Hincks. When he became Dean of the Faculty of Medicine at the University of Toronto, he oversaw creation of the Department of Psychiatry, and development of the medical school.  Clarke first practised psychiatry at the 999 Queen Street institution in Toronto. In 1880, then took a post at the Hamilton asylum.  Clarke was a student and brother-in-law of Dr. Joseph Workman, Superintendent of the Toronto Asylum. Clarke was an early proponents of eugenics, emphasizing the importance of restrictive laws that would limit the immigration and marriage of the 'mentally defective.' To them, such laws seemed necessary to stem the explosive growth of state and provincial mental asylums where foreign-born patients made up more than 50 percent of the hospital population. Further, the growth of hereditarian views in science supported eugenic proposals; psychiatry's desire for greater respectability in the medical profession made eugenic 'science' attractive. By 1905, Clarke had abandoned the movement, and many of the other leading psychiatrists would follow suit by the end of World War I, when it was clear that eugenic measures were not having the desired effects. He joined his other brother-in-law, Dr. William Metcalfe at the Rockwood Hospital for the Insane, the psychiatric hospital in Kingston in 1881 and began a series of reforms in the care of the insane. One of these was freeing patients from confinement. On August 13, 1885, a paranoid patient attacked them both and killed Dr. Metcalfe. Dr. Clarke survived and succeeded his brother-in-law as Medical superintendent of facility. Dr. Clarke carried on in Kingston until 1905 when he succeeded Dr. Daniel Clark as superintendent of the Toronto Asylum. In 1911 he resigned from government service and was appointed superintendent of the Toronto General Hospital.  Clarke became ill in the autumn of 1923 and died in Toronto early the next year. A headline in the Toronto Sunday World of March 23, 1924 read 'Canada owes immeasurable debt to Dr. C.K. Clarke who helped to lift the shadow of misery and hopelessness from insane asylums'. The Clarke Institute of Psychiatry in Toronto, Canada is named in his honour.  He is also remembered as the 'Father of Canadian Psychiatry.'" ,
moreInfo: ["http://www.archivescanada.ca/english/search/ItemDisplay.asp?sessionKey=999999999_142&l=1&lvl=1&v=0&coll=1&itm=210155&rt=1&bill=1", "http://www.biographi.ca/EN/009004-119.01-e.php?id_nbr=8077"]
},

{
name: "Margaret Gunn",
dates: "1924",
blurb: "President of the United Farm Women of Alberta",
heroQuote: "Gunn pushed for better Education in Alberta.", 
villainQuote: "Democracy was never intended for degenerates.", 
image: "/images/heroes/female.jpeg",
tags: ["Citizen", "Female"],
description: "Main description goes here" 
},
{
name: "Reginald Ruggles Gates",
dates: "1882-1962",
blurb: "Canadian anthropologist, botanist, and geneticist.",
ambiQuote: "While it is necessary to recognise the fundamental importance of inherited physical and mental differences, as the foundation of Eugenics, one must also remember that environment counts ... It is these potential (germinal) differences on which the Eugenist must rely in any effort to improve the race or direct the selection of germinal qualities which is going on in every generation.",  
image: "/images/heroes/Gates.jpeg",
tags: ["Scientist", "Male"],
description: "Gates had become known for his studies of Oenothera and other plants, but in 1923 he brought out Heredity and Eugenics. He had a long interest in eugenics, but it was after this book onward that his reputation as a eugenicist become prominent. He considered racial differences to be great, but did not necessarily believe in a pure form of Caucasian. That stated he believed African Americans to be mentally inferior and attempted to prove this. He maintained his ideas on race and eugenics long after World War II, into the era when these were deemed anachronistic. He was a founder of Mankind Quarterly, which at that time was associated to the International Association for the Advancement of Ethnology and Eugenics." ,
moreInfo: ["http://www.kcl.ac.uk/library/collections/archivespec/collections/rugglesgates.aspx"]
},
{
name: "John Harvey Kellogg",
dates: "1852-1943",
blurb: "Inventor of Cornflakes breakfast cereal",
heroQuote: "The power in which we must have faith if we would be well, is the creative and curative power which exists in every living thing.", 
villainQuote: "We must support eugenics and race segregation for the preservation of the human race.", 
image: "/images/heroes/Kellogg.jpeg",
tags: ["Doctor", "Businessman", "Male"],
description: "An American medical doctor in Battle Creek, Michigan, who ran a sanitarium using holistic methods, with a particular focus on nutrition, enemas and exercise, Kellogg was an advocate of vegetarianism and is best known for the invention of the corn flakes breakfast cereal with his brother, Will Keith Kellogg. He led in the establishment of the American Medical Missionary College. The College, founded in 1895, operated until 1910 when it merged with Illinois State University.  Kellogg was outspoken on his beliefs on race and segregation, though he himself adopted a number of black children. In 1906, together with Irving Fisher and Charles Davenport, Kellogg founded the Race Betterment Foundation, which became a major center of the new eugenics movement in America. Kellogg was in favor of racial segregation and believed that immigrants and non-whites would damage the gene pool." 
},
{
name: "John MacEachran",
dates: "1877-1971",
blurb: "Canadian philosopher and psychologist of the University of Alberta",
ambiQuote: "Sterilization [was] a sound, humane and effective procedure, and [was] one of the chief means of coping with the grave problem of the increasingly large number of mentally sick and mentally deficient persons that each province [was] being called upon to care for",  
image: "/images/heroes/MacEachran.jpeg",
tags: ["Academic", "Doctor", "Male"],
description: "A Canadian philosopher and psychologist, MacEachran's most notable credentials involved the development of the Psychology and Philosophy Department at the University of Alberta. He was a co-founder of the Canadian Psychological Association and the appointed Chairman of the Alberta Eugenics Board which was responsible for approving sterilization of thousands of Albertans. Two classes of individuals were sterilized - those with low mental IQ's and those who had suffered serious mental breakdowns, and therefore could not be recommended for parenthood by any physician. J.M. MacEachran was appointed Head of Alberta Eugenics Board in 1928, immediately after the Alberta government enacted the Sexual Sterilization Act of Alberta. MacEachran was appointed Chairman for the purpose of developing a philosophical justification for the eugenics movement. He was an ideal candidate for the position because of his extensive background in philosophy and psychology. He signed order for battered children who later graduated Grade 12, Native children whose families who spoke only Cree or Blackfoot, abused girls, teenagers with hearing or speech problems, individuals with cerebral palsy, M.S and rare genetic disorders of the hands and feet.  MacEachran resigned from Chairman of the Alberta Eugenics Board on June 30, 1965, serving for 38 consecutive years. During his term as Chairman, MacEachran signed over 3200 applications approving for sterilization of adults and children (~60% of approvals resulted in sterilizations).  Many of his honours and portraits have been since repealed at the University of Alberta." 
},
{
name: "Emily Murphy",
dates: "1868-1933",
blurb: "Canadian women's rights activist and magistrate",
heroQuote: "I think women can save civilization.", 
villainQuote: "Mentally defective children are a menace to society and an enormous cost to the state.", 
image: "/images/heroes/Murphy.jpg",
tags: ["Feminist", "Politician", "Female"],
description: "Murphy was a Canadian women's rights activist, jurist, and author. In 1916, she became the first female magistrate in Canada, and in the British Empire. She is best known for her contributions to Canadian feminism, specifically to the question of whether women were 'persons' under Canadian law.  Murphy is known as one of the 'The Famous Five' (also called 'The Valiant Five')—a group of Canadian women’s rights activists that also included Henrietta Muir Edwards, Nellie McClung, Louise McKinney and Irene Parlby. In 1927, the women launched the 'Persons Case,' contending that women could be 'qualified persons' eligible to sit in the Senate. The Supreme Court of Canada ruled that they were not. However, upon appeal to the Judicial Committee of the British Privy Council, the court of last resort for Canada at that time, the women won their case.  Murphy, who was a pacifist, theorized that the only reason for war was that nations needed to fight for land to accommodate their growing populations. Her argument was that: if there was population control, people would not need as much land. Without the constant need for more land, war would cease to exist. Her solution to these social issues was eugenics. Selective breeding was considered a progressive scientific and social approach and Murphy supported the compulsory sterilization of those individuals who were considered mentally deficient. She believed that the mentally and socially inferior reproduced more than the 'human thoroughbreds' and appealed to the Alberta Legislative Assembly for eugenic sterilization.  She wrote to Minister of Agriculture and Health, George Hoadley that two female 'feeble-minded' mental patients already bred several offspring. She called it: 'a neglect amounting to a crime to permit these two women to go on bearing children. They are both young women and likely to have numerous offspring before leaving the hospital'. Due in part to her heavy advocacy of compulsory sterilization, thousands of Albertans, who were not considered to possess any intelligence, were sterilized without their knowledge or consent under the Sexual Sterilization Act of Alberta before its repeal in 1972." 
},
{
name: "Tommy Douglas",
dates: "1904-1986",
blurb: "Canadian politician, who introduced universal healthcare. ",
ambiQuote: "The matter would have to be handled carefully. Only those mentally defective and those incurably diseased should be sterilized. Many subnormal families whose intelligence is not of a high order are capable of raising useful citizens.", 
image: "/images/heroes/TommyDouglas.jpeg",
tags: ["Politician", "Minister", "Male"],
description: "Douglas was a Scottish-born Baptist minister, and Canadian democratic socialist politician. He was elected to the Canadian House of Commons in 1935 as a member of the Co-operative Commonwealth Federation (CCF) party. He left federal politics to become the Saskatchewan CCF's leader and then the seventh Premier of Saskatchewan from 1944 to 1961. His government was the first democratic socialist government in North America, and it introduced the continent's first single payer, universal health care program.  After setting up Saskatchewan's medicare program, he stepped down as premier and ran to lead the newly formed federal New Democratic Party, the National CCF's successor party. Douglas was elected as its first federal leader in 1961. Although he never led the party to government, through much of his tenure, the party held the balance of power in the House. He was noted as being the main opposition to the imposition of the War Measures Act during the 1970 October Crisis. He resigned as leader the next year, but remained as a Member of Parliament until 1979. He was awarded many honorary degrees, and a foundation was named for him and his political mentor Major James Coldwell during 1971. In 1981, he was invested into the Order of Canada; and became a member of Canada's Privy Council in 1984. He died in 1986 after a battle with cancer. In 2004, a CBC Television program named him 'The Greatest Canadian,' based on a viewer-supported survey.  Tommy Douglas, wrote his 1933 master’s thesis on the 'Problem of the Subnormal Family.' In his thesis he looked at 12 women who lived in Weyburn Saskatchewan and divided them into categories of ‘immoral’ and ‘amoral’ citizens.  He separated the groups according to their behaviour, the immoral women were petty criminals, prostitutes, and understood that their actions were wrong.  The second group, the ‘amoral’ women, may have committed similar crimes but did not appreciate that these actions were wrong.  He considered this second group of women to be mentally defective, or impaired in judgment.  After tracing their activities and families over two generations, he had identified two hundred people: the original twelve women had ninety-five children collectively, and those in turn had one hundred and five children.  Douglas then analysed the intelligence levels, disease states, and criminal activity of this entire group of people.  He concluded that people in these categories tended to have more children, and those children were more likely to engage in immoral activities.  His solution to this problem rested with the Church. He claimed that 'The task of the church, was to find an outlet for their social desires.  To help them to play their roles as parents, as children, as citizens, and as human beings.' Douglas rarely mentioned his thesis later in his life and his government never enacted eugenics policies even though two official reviews of Saskatchewan's mental health system recommended such a program when he became premier and minister of health. By that time, many people questioned eugenics after Nazi Germany had embraced it to create a 'master race'. Instead, Douglas implemented vocational training for the mentally handicapped and therapy for those suffering from mental disorders." 
},
{
name: "Robert Charles Wallace",
dates: "1881-1955",
blurb: "Present of the University of Alberta, principal of Queen's University.",
heroQuote: "University is the place for untrammelled thinking in the fundamentals of human life and conduct and for unbiased appreciation of the values in the aesthetic and moral spheres.", 
villainQuote: "The time has come to make eugenics not only a scientific philosophy but in very truth a religion.", 
image: "/images/heroes/Wallace.jpeg",
tags: ["Academic", "Male"],
description: "Wallace was a Scots-Canadian geologist, educator, and administrator who served as president of the University of Alberta (1928–1936), the principal of Queen’s University (1936–1951), and the head of the Arctic Institute of North America (1951–1955).  Controversially, Robert Wallace was a prominent and outspoken advocate of eugenics and selective breeding programs, particularly during his time in Alberta. In an address to the Canadian Medical Association entitled 'The Quality of the Human Stock' in Calgary in June 1934, Wallace asserted the following: 'Science has done very much to raise the quality of the stock in the domesticated animals which man has reared for his service; it has done virtually nothing to raise the quality of the human stock.' Wallace, along with fellow University of Alberta faculty member John MacEachran, was a frank supporter of Alberta’s eugenic legislation, including the 1928 Sexual Sterilization Act, which permitted the forcible sterilization of 'undesirables' in the province. Alberta was one of only two provinces (the other was British Columbia) to pass such legislation. The Act was not repealed until 1972." 
},
{
name: "Amos Wilton",
dates: "1925",
blurb: "A concerned citizen writing to a paper",
heroQuote: "Sterilization means death: a living death, the end of the means employed by the author of life for the perfecting of the human race [...] I shall oppose [the bill] with all the strength of my manhood.", 
image: "/images/heroes/man.jpeg",
tags: ["Citizen", "Male"],
description: "Amos Wilton was a labourer and concerned citizen, who wrote in to the 'Red Deer News' during a period of great conversation surrounding eugenics in the early 1920s.  Believed to be born in 1864 in Essex, ON, Wilton died in 1925 in Delburne, AB.  He was married to Agnes Redman, and had four children: Ruby, Thomas, Leroy, and Evert. It is believed he wrote a local history book, entitled, 'Through the years'.  He was the son of farmer Thomas Wilton and wife Hanna Plant, and president of content association in Alberta.  His eloquent editorial on eugenics represents the fervent discussion around the topic in Western Canadian newspapers at the time." 
},
{
name: "G.H. Wade",
dates: "1928",
blurb: "The mayor of Hanna, Alberta, and a medical doctor.",
ambiQuote: "Sterilize a mentally defective girl and turn her loose, what is the likely result? I fear you have made a prostitute that will spread venereal disease like prairie fire.",  
image: "/images/heroes/man.jpeg",
tags: ["Politician", "Doctor", "Male"],
description: "The mayor of a small town in Alberta, Hanna, G.H. Wade also served as a medical doctor.  Another concerned Western Canadian who voiced his views on eugenics through editorials in newspapers, Mayor Wade voiced opposition to eugenics.  However, his viewpoint was very negative towards women, and so although he opposed eugenics, it may not have been for the most ethical of reasons.  This is representative of the many viewpoints surrounding eugenics - sometimes it was opposed for wrong reasons; sometimes it was supported for right ones." 
},
{
name: "Herbert Bruce",
dates: "1868-1963",
blurb: "Lieutenant Governor of Ontario and doctor",
heroQuote: "Champion of cancer care in 1920s, social housing in 1930s, and the introduction of contributory health insurance in the 1940s.", 
villainQuote: "Sterlization is damning up the foul stream of degenracy and devaluation, which are pouring pollution into the nation's lifeblood.", 
image: "/images/heroes/Bruce.jpeg",
tags: ["Politician", "Doctor", "Male"],
description: "Herbert Bruce was born at Blackstock in 1868, and grew up on a farm in Port Perry. In 1893, he graduated in medicine from the University of Toronto. Specializing in surgery, he rose to the top of his profession, and in 1911 founded the Wellesley Hospital, Toronto. During the First World War, he was appointed Inspector-General of the Canadian Medical Services and produced the Bruce Report, a frank criticism of medical care provided to Canadian soldiers serving overseas. His report was disowned by the government at the time and he was dismissed from his duties, though many of his recommendations were ultimately implemented. In 1919, he published Politics and the Canadian Army Medical Corps, criticizing the government for its actions. In 1919, Bruce married Angela Hall. Dedicated to public service, Bruce was appointed Lieutenant Governor of Ontario (1932-1937) and served as the Conservative member of Parliament for Parkdale, Toronto (1940-1946). In 1934, Bruce condemned the state of Toronto’s poorer neighbourhoods, and was a vocal member of the Opposition during the Second World War. Bruce championed cancer care in the 1920s, social housing in the 1930s, better health care for the military and veterans, and the introduction of contributory health insurance in the 1940s.  Bruce was a staunch supporter of eugenics. In addressing a 1936 Social Welfare Conference in Toronto Dr. Bruce remarked approvingly that: 'Fifty thousand idiots have been sterilized in Germany who will henceforth be unable to have idiot children.'" 
},
{
name: "Leonard J. LeVann",
dates: "1915-1987",
blurb: "The medical superintendent at the Michener Centre.",
heroQuote: "LeVann was a dedicated physician. He served in the Spanish Civil War, and  in 1943 served in war-ravaged England; he was awarded a medal for bravery. ", 
villainQuote: "The comparison between the normal child and the idiot might almost be a comparison between two separate species.", 
image: "/images/heroes/LeVann.jpeg",
tags: ["Doctor", "Male"],
description: "LeVann was the medical superintendent at the Alberta Provincial Training School for Mental Defectives (also known as the Michener Center) from the years 1949–1974. Although he was born and raised in the United States, Le Vann trained as a physician in Scotland. Throughout his career Le Vann wrote many articles, the majority of which were published during his 25-year career at the Provincial Training School. These articles covered a broad range of topics that include alcoholism, schizophrenia and experimental treatments of antipsychotic drugs. In 1974 Le Vann resigned from the training center, which was due to the Conservative Party of Alberta’s repeal against the Sexual Sterilization Act of Alberta. Furthermore, there has been plenty of controversy about how he ran the school. This controversy has been brought to attention mainly because of the Leilani Muir trial that took place in 1995. As superintendent of the Provincial Training School Le Vann duties were to manage the school, to perform psychological analysis and to operate when other professionals were not available. Another of his major responsibility was to analyze the students that were candidates for sterilization. Once a sterilization request was approved by the Alberta Eugenics Board the school would use a number of different techniques to sterilize the child. The most popular were bilateral salpingectomy and oophorectomies for the female students and vasectomies and castration for the male students.  Another one of Le Vann’s tasks as the acting superintendent of the training center was to conduct experiments on the effectiveness of different antipsychotic drugs. He experimented with compounds such as 'trifluoperazine (Le Vann 1959), thioridazine (Le Vann 1961), trifluperidol (Le Vann 1968) and haloperidol and chlorpromazine.' Le Vann also believed that for the children to develop to their highest potential a balance between work, education and play was required. This became known as the workhouse model. It was standard practice to have teenage girls 'spend their days scrubbing floors, making meals and dressing and changing the diapers of the severely disabled students '. As for the less cognitively defective male students, he would have them milk cows and perform other laborious tasks.  In 1960 Le Vann had his most famous patient admitted to the Provincial Training School. The premier of Alberta, Ernest Manning, entrusted the well being of his son, Keith to Le Vann. Le Vann provided excellent service to the premier’s son, providing him with a special double room and the use of a typewriter. Le Vann was the superintendent of the Provincial Training School for twenty-five years. In 1971 the Conservative party of Alberta won the election. Soon after, they repealed the Sexual Sterilization Act of Alberta. This had an immense impact on the school, 'closing wards and tearing down dorms'. Eventually in 1974, Dr. Leonard Jan Le Vann resigned from the facility. The old Provincial Training School was eventually closed and renamed the Michener Center. As of 2009 the Michener center supports 274 adults by 'providing an impressive range of recreational, social, residential, spiritual and health services'",
moreInfo: ["http://en.wikipedia.org/wiki/Leonard_Jan_Le_Vann"]
},
{
name: "Irene Parlby",
dates: "1868-1965",
blurb: "Canadian women's farm leader, activist, and politician.",
heroQuote: "She welcomed cultural diversity and 'the variety ... [it] bring[s] in the things of the spirit, in the genius of ... different races ... to enrich our national life.'", 
villainQuote: "She repeatedly alarmed the public to the growing rate at which the 'mentally deficient' were propagating. Her 'great and only solution to the problem' was sterilization.", 
image: "/images/heroes/parlby.jpg",
tags: ["Feminist", "Politician", "Female"],
description: "Born in London, England, Parlby came to Canada in 1896. In 1913, Parlby helped to found the first women's local of the United Farmers of Alberta. In 1921, she was elected to the Alberta Legislature for the riding of Lacombe, holding the riding for 14 years. Appointed as minister without portfolio, she was the first woman Cabinet minister in Alberta. Parlby was one of the Famous Five or Valiant Five, who by means of a court battle known as the Persons Case established that women were 'qualified Persons' in the meaning of the Constitution of Canada and therefore entitled to sit in the Senate of Canada. A lifelong advocate for rural Canadian women and children, Parlby was president of the United Farm Women of Alberta from 1916 to 1919. On behalf of the UFWA, she pushed to improve public health care services and establish municipal hospitals as well as mobile medical and dental clinics. In 1921, Parlby was elected to the provincial legislature and made a cabinet minister (the second woman in Canada to hold a provincial cabinet post).  However, like many of the famous five, she was a staunch supporter of eugenics."
},
{
name: "James Shaver Woodsworth",
dates: "1874-1942",
blurb: "A pioneer in the Canadian social democratic movement.",
ambiQuote: "I believe that we in Canada must work out our salvation in our own way. I am convinced that we may develop in Canada a distinct type of socialism.",
image: "/images/heroes/woodsworth.jpg",
tags: ["Politician", "Minister", "Male"],
description: " Following more than two decades ministering to the poor and the working class, J. S. Woodsworth left the church to lay the foundation for, and become the first leader of, the Co-operative Commonwealth Federation (CCF), a democratic socialist party that later became the secular social-democratic New Democratic Party (NDP).  J. S. Woodsworth, while a preacher and Superintendent of All People’s Mission in Winnipeg conducted and published studies on immigration and social response. Woodsworth’s reports concerning the quality of immigrants aided in creating a public crisis. Together, with Emily Murphy, these individuals published numerous articles in popular magazines and spoke at public meetings in support of sterilization.  He was also Tommy Douglas' mentor and family pastor." 
},
{
name: "Louise McKinney",
dates: "1868-1931",
blurb: "Provincial politician and activist",
heroQuote: "Develop honour, justice, and everything that is big.", 
villainQuote: "Louise McKinney was convinced that the improvement of the Anglo-Saxon race in Canada required limits on immigration.", 
image: "/images/heroes/mckinney.jpg",
tags: ["Feminist", "Politician", "Female"],
description: "McKinney was the first woman sworn in to the Legislative Assembly of Alberta and the first woman elected to a legislature in Canada and in the British Empire. She served that position from 1917 to 1921 sitting with the Non-Partisan League caucus in opposition.  McKinney believed in temperance education, stronger liquor control, women's property rights and the Dower Act. She was one of two woman sworn into the Alberta Legislative Assembly on 7 June 1917, the other being Roberta MacAdams. McKinney became one of 'The Famous Five' (also called 'The Valiant Five'), along with Irene Parlby, Henrietta Muir Edwards, Emily Murphy and Nellie McClung.  As the rest of the famous five, McKinney was a staunch supporter of eugenics." 
},
{
name: "Clarence Hincks",
dates: "1885-1964",
blurb: "Father of Mental Health in Canada",
heroQuote: "We need [to] recognize the fact that we are in the ox cart stage of development... In Amsterdam they haven't built a mental hospital in years because their mental health workers are working in the community, where they should be working.", 
villainQuote: "We have abundant evidence in Canada that the free propagation of mental subnormals is carrying us far in the direction of race deterioration. It is my conviction that highly selective eugenical sterilization should be part of our expanding health programs.", 
image: "/images/heroes/hincks.jpg",
tags: ["Doctor", "Male"],
description: "Dr Clarence Hincks was born in St Mary's, Ontario, the only child of a schoolteacher and a Methodist minister. His interest in mental health was partly the result of his own experiences with severe depression. In 1918, with Beers's help, he organized the Canadian National Committee for Mental Hygiene, which later became the Canadian Mental Health Association. Both organizations were influential in promoting mental-health issues in both the US and Canada. After WWI, he toured asylums across Canada, and was shocked by what he found. This project that the CNCMH and Hincks took on, along with Dr. C.K. Clarke, was conducting provincial surveys of institutions, and making subsequent recommendations to the provincial government. In 1919, Hincks and the CNCMH carried out a survey in Alberta, visiting several mental institutions. The results of their survey, published in 1921 attributed the frightening social inefficiency and corruption to mental inadequacy, and fervently recommended sterilization as a preventative measure. Indeed, they claimed to have found a link between mental abnormality and immorality.In 1920, with Beers, he organized the International Committee for Mental Hygiene (which in 1948 became the World Federation for Mental Health, headquartered in London) and helped plan the first International Congress on Mental Hygiene, which was held in Washington in 1930. Hincks was one of the first physicians to recognize the value of prevention and of treating sufferers of mental illness before they were incapacitated. His work led to the development of child-guidance clinics for the early detection and prevention of mental illness. Perhaps because of the psychoanalytic focus on the development of children or because of Hincks's conviction that mental health began in childhood, academic interest in child development began in earnest during this time. Hincks persuaded benefactors to fund the St George's School for Child Study at the University of Toronto and the McGill University Nursery School and Child Laboratory in Montréal in 1925." 
},
{
name: "H.E. Smith",
dates: "1960",
blurb: "An environmentalist.",
ambiQuote: "The extent of mental illness is very hard to measure, because there has always been a certain stigma attached to a person being committed to a mental institution, and a certain stigma attached also to the family - old wives' tales about heredity and so on.", 
image: "/images/heroes/smith.png",
tags: ["Scientist"],
description: "No information found." 
},
{
name: "William Aberhart",
dates: "1878-1943",
blurb: "Seventh Premier of Alberta",
heroQuote: "If we cannot feed, clothe and shelter the people of Alberta, tell me who else is going to do it?", 
villainQuote: "We have found a scientific way out of our troubles [eugenics], and if we don 't do it, then nobody else will.", 
image: "/images/heroes/aberhart.gif",
tags: ["Politician", "Male"],
description: "Also known as Bible Bill for his outspoken Baptist views, was a Canadian politician and the seventh Premier of Alberta between 1935 and 1943.[1] The Social Credit party believed the reason for the depression was that people did not have enough money to spend, so the government should give everyone $25/month to stimulate the economy. Aberhart also campaigned for and instituted several anti-poverty and debt relief programs during his premiership.  The Social Credit government of William Aberhart, which came to power in 1935, and was keen on speeding up the works, expanded the Alberta Eugenics Board’s powers in 1937 by dispensing with the need to acquire consent for sterilization from mental defectives; five years later, another Social Credit majority broadened the net to include some individuals with epilepsy and Huntingdon’s chorea.  But even as Aberhart, the young Ernest Manning, and other Social Credit members were registering their endorsement of eugenics, other observers, such as the future NDP leader Tommy Douglas, were repudiating it in the wake of revelations from Germany, where thousands of mentally retarded citizens were being sterilized and later gassed, in the service of Nazi aster-race theories. It was the start of the Holocaust. By the late forties, in the forum at Nuremberg, the civilized world had judged forced sterilization a crime against humanity." 
},
{
name: "Ernest Manning",
dates: "1908-1996",
blurb: "Eighth Premier of Alberta",
heroQuote: "Education, health, and highways were priorities of Premier Manning's Government. In 1947, it legislated free hospital and medical care for senior citizens.", 
villainQuote: "Ernest Manning, removed the need to obtain consent to sterilize 'mental defectives,' resulting in citizens [being] sterilized, lied to, experimented on, and subjected to daily abuse at the hands of provincial staff in Alberta..", 
image: "/images/heroes/manning.jpg",
tags: ["Politician", "Male"],
description: "Manning was a Canadian politician, and the eighth Premier of Alberta between 1943 and 1968 for the Social Credit Party of Alberta. He served longer than any premier in the province's history, and was the second longest serving provincial premier in Canadian history (only after George H. Murray of Nova Scotia). For a period of time, Manning was the longest continually serving democratically elected official in the world. He was also the only member of the Social Credit Party of Canada to ever sit in the Senate.  Manning was such a staunch supporter of eugenics, that he had his own son, Keith Manning, committed to the Alberta Provincial Training School, where Dr. J. Le Vann provided excellent service to the premier's son, providing him with a special double room and the use of a typewriter. At one point, a concerned parent of one of the children being detained in this 'school' wrote Premier Ernest Manning.  The letter was  detailed account of many things that had gone on in the school, relating to her 16-year old teenage boy.  Manning sent back a two page letter that contained the following quote: 'I feel that the staff of the Training School is doing everything possible within existing facilities to give proper care to the youngsters there'.  He wrote this even after being told that at one point the boy was caught talking alone to another student who was female, strictly forbidden activity; he was put in a 'quiet room' and a day later they found him lying dazed, in a pool of his own blood, amid shards from a chamber pot." 
},
{
name: "Peter Lougheed",
dates: "1928-2012",
blurb: "Canadian lawyer and tenth premier of Alberta.",
heroQuote: "We feel very, very strongly that the [sterilization] bill is offensive and at odds with the proposed Bill of Rights.", 
image: "/images/heroes/lougheed.jpeg",
tags: ["Politician", "Lawyer", "Male"],
description: "A Canadian lawyer and politician. He served as the tenth Premier of Alberta from 1971 to 1985 as a Progressive Conservative.  As premier, Lougheed furthered the development of the oil and gas resources, and started the Alberta Heritage Fund as a way of ensuring that the exploitation of non-renewable resources would be of long-term benefit to Alberta. He also introduced the Alberta Bill of Rights. From 1996 to 2002, Lougheed served as Chancellor of Queen's University. Lougheed sat on the boards of a variety of organizations and corporations. In a 2012 edition, the Institute for Research on Public Policy's magazine, Policy Options, named Lougheed the best Canadian premier of the last forty years.  The forced sterilization of mentally ill people was clearly inconsistent with the principles of the rights revolution of Lougheed's time. It is no surprise that the Peter Lougheed government, which had already introduced wide-ranging human rights legislation and was preparing to remove restrictions against Hutterites, eliminated the Sexual Sterilization Act in 1972. Premier Lougheed, speaking before the legislature, explained that 'we feel very, very strongly that the bill is offensive and at odds with the proposed Bill of Rights.' " 
},
{
name: "George Hoadley",
dates: "1866-1945",
blurb: "Architect of Alberta's Sexual Sterilization Act",
heroQuote: "The demand of today is that the gulf between the people so greatly in need of modern scientific medical and hospital service on the one side and the professions and institutions properly organized and equipped to provide this service on the other, be bridged.", 
villainQuote: "There is a 'need for the state to be protected from the menace which the propagation by the mentally diseased brings about.'", 
image: "/images/heroes/hoadley.jpg",
tags: ["Politician", "Male"],
description: "Hoadley was a long serving popular provincial politician and rancher from Alberta, Canada. Hoadley served a legendary career in the Alberta legislature during the early years when he led the Alberta Conservative Party in opposition and his effect in shaping policy in the province is widely remembered to this day as he served a broad range of portfolios during his years in the United Farmers government.  He was also one of the primary architects behind the Sexual Sterilization Act one of the most controversial pieces of legislation in Alberta history." 
},
{
name: "John Edward Brownlee",
dates: "1883-1961",
blurb: "Fifth Premier of Alberta.",
ambiQuote: "There is no need to fear that because a person is unfortunate enough to become temporarily an inmate of a mental hospital that that fact will put that unfortunate one within the provisions of the Bill. 'That a sterilization could only take place with the unanimous approval of ... an array of professionals seemed to Brownlee complete assurance that no unreasonable action or medical abuse would take place.'", 
image: "/images/heroes/brownlee.jpg",
tags: ["Politician", "Male"],
description: "The fifth Premier of Alberta, Canada, serving from 1925 until 1934, Brownlee was born in Port Ryerse, Ontario, he studied history and political science at the University of Toronto's Victoria College before moving west to Calgary to become a lawyer. His clients included the United Farmers of Alberta (UFA); through his connection with that lobby group, he was involved in founding the United Grain Growers (UGG). After the UFA entered electoral politics and won the 1921 election, new premier Herbert Greenfield asked Brownlee to serve as his attorney-general. Brownlee agreed, and was elected to the Legislative Assembly of Alberta in a by-election in the riding of Ponoka. As attorney-general, he was an important advisor to Greenfield's government. He was closely involved in its most important activities, including efforts to better the lot of farmers living in Alberta's drought-ridden south, divest itself of money-losing railways, and obtain authority over natural resources from the federal government. When a group of UFA backbenchers grew frustrated with Greenfield's weak leadership, they asked Brownlee to replace him. Brownlee eventually agreed, and became premier in 1925. Brownlee enjoyed considerable early success as premier: he handily won the 1926 election, signed an agreement with the federal government transferring control over Alberta's natural resources to its provincial government, sold the railways to the Canadian National and Canadian Pacific railway companies, and ran a series of balanced budgets. Control of natural resources and the divestment of the railways were two factors that permitted balanced provincial budgets, the first of which was registered in 1925. Despite this success, Brownlee continued to advocate austerity, and tried unsuccessfully to persuade the federal government to assume a greater share of the costs of new social programs, such as the old age pension. His resulting reputation as a penny-pincher came at a cost to his personal popularity.  Brownlee's government also attempted to advance a progressive agenda. One way this manifested itself was an attempt to consolidate Alberta's thousands of school districts into a far smaller number of school divisions. The plan was supported by educational reformers who believed that the decentralized status quo made province-wide reform impossible, but was scrapped when rural residents expressed fears that it would mean the closure of local schools. Another progressive initiative was the Sexual Sterilization Act of Alberta, which allowed for the sterilization of 'mental defectives'. While the act, repealed in 1972, is now viewed as barbaric, at the time it enjoyed the support of moral reformers like Nellie McClung, who believed it was for the subjects' own protection.Things became more difficult with the advent of the Great Depression. Brownlee found himself unable to restore the province to prosperity in the face of a global economic crisis, and reluctantly ran budget deficits. Political radicalism increased, and Brownlee found his orthodox approach to political economy attacked from multiple sides." 
},
{
name: "Henrietta Muir Edwards",
dates: "1849-1931",
blurb: "Canadian Women's Rights Activist and Reformer",
heroQuote: "If women had the vote there would be no need to come twice asking for better legislation for women and children, no need to come again and again for the appointment of women inspectors where women and children are employed; we would not ask in vain for the raising of the wage or consent.", 
villainQuote: "Supporter of eugenics", 
image: "/images/heroes/edwards.jpg",
tags: ["Feminist", "Female"],
description: "Edwards was one of 'The Famous Five' (also called 'The Valiant Five'). Among other honours, in October 2009, the Senate voted to name Edwards and the rest of the Five Canada's first 'honorary senators.' She was born Henrietta Louise Muir in Montreal. As a young woman, she exposed various feminist causes, forming the Working Girls' Association in 1875 to provide vocational training for women and editing the journal Women's Work in Canada.  Like the rest of the Famous Five, Edwards was a supporter of eugenics." 
},
{
name: "E. J. Kibblewhite",
dates: "1937",
blurb: "A social worker who supported eugenic legislation.",
villainQuote: "Convincing men to become sterilized would be difficult because 'the operation would be a blow to [their] pride or vanity.'", 
image: "/images/heroes/man.jpeg",
tags: ["Citizen", "Male"],
description: "A social worker, who believed based on his work with mental health professional, R.R. MacLean, that an amendment to the Sexual Sterilization Act in 1937 was celebrated and warranted.  This amendment increased the power that the Board held over individuals- sterilization procedures could now be performed if the Board deemed an individual 'incapable of intelligent parenthood.'  This success was celebrated by the co-authoring of an article between Kibblewhite and MacLean, where they noted the increasing simplicity with which they could proceed with their work. There was a high correlation between absence of consent requirement and subsequent sterilization: 89% of all presented and passed individuals whose cases did not require consent were sterilized, as opposed to 15% of cases where consent was necessary. A month after the 1937 amendment to the act, a special meeting was held in order to bring up cases presented in the past, where individuals were previously outside the scope of the Eugenics Board, but now were within the Board’s jurisdiction.  A later amendment, in 1942, further increased the efficiency of the Board. Non-psychotic individuals with syphilis, epilepsy, and Huntington's Chorea were now encompassed by the Act, however for an unknown reason, the Board maintained that consent was still required in these cases. " 
},
{
name: "Nellie McClung",
dates: "1873-1951",
blurb: "A Canadian politician and feminist activist",
heroQuote: "Chivalry is a poor substitute for justice, if one cannot have both.", 
villainQuote: "The patient may safely be discharged if the danger of procreation with its attendant risk of multiplication of the evil by transmission of the disability to the progeny were eliminated, the board may direct ...sexual sterilization of the inmate.", 
image: "/images/heroes/mcclung.jpg",
tags: ["Feminist", "Politician", "Female"],
description: "A Canadian feminist, politician, and social activist, McClung was a part of the social and moral reform movements prevalent in Western Canada in the early 1900s. In 1927, McClung and four other women: Henrietta Muir Edwards, Emily Murphy, Louise McKinney and Irene Parlby, who together came to be known as 'The Famous Five' (also called 'The Valiant Five'), launched the 'Persons Case,' contending that women could be 'qualified persons' eligible to sit in the Senate. The Supreme Court of Canada ruled that current law did not recognize them as such. However, the case was won upon appeal to the Judicial Committee of the British Privy Council—the court of last resort for Canada at that time.  However, like the rest of the Famous Five, McClung was a supporter of the then popular social philosophy of eugenics and campaigned for the sterilization of those considered 'simple-minded'. Her promotion of the benefits of sterilization contributed to the passage of eugenics legislation in Alberta." 
},
{
name: "Clarence B. Farrar",
dates: "1874-1970",
blurb: "Psychiatrist and Director of the Toronto Psychiatric Hospital",
heroQuote: "Perturbations of the soul (mental diseases) are, in reality, diseases of the nervous system, and more particularly of the brain, and ... therefore, their treatment was the proper work of the physician, and not of the priest.", 
villainQuote: "Anyone who protests the eugenic solution of sterlization, an essential cog in the wheel of the public health movement, is clearly sentimental; [...] benefits far outweigh the risks: Along ninety-nine potential defectives whose propagation is prevented by sterlization, possibly one potential genius will be lost.", 
image: "/images/heroes/farrar.jpeg",
tags: ["Doctor", "Male"],
description: "An influential psychiatrist, the first Director of the Toronto Psychiatric Hospital (succeeded in 1966 by the Clarke Institute), and editor of The American Journal of Psychiatry for 34 years, as a chief psychiatrist for the Canadian Army, Captain Farrar researched psychiatric cases of soldiers with shell shock and published his findings with Charles Kirk Clarke.  Farrar was a noted critic of the Emmanuel Movement. He was also a member of the Eugenics Society of Canada, and, believing that heredity was the primary cause of mental illness, supported some arguments regarding compulsory sterilization of 'mental deficients'." 
}
];


  FlipCard.CardView.prototype.events = {
    'click' : 'showDetail'
  };

  // This instantiates a new "FlipCard" view, passing in the relevant settings, including
  // the data JSON we created above. When paired with the proper HTML and Javascript files
  // it will basically run the grid-view. 

  var flipcard = new FlipCard.AppView(data, {
          wrapper: "#flipcard-wrapper",
          toolbar: "#flipcard-toolbar",
          detailView: "#flipcard-detail",
          searchField: "#flipcard-search",
          toolbarTemplate: _.template($('#toolbar-template').html()),
          cardViewTemplate: _.template($('#card-view-template').html()),
          detailViewTemplate: _.template($('#detail-view-template').html()),
          boxHeight: 300,
          boxWidth: 200,
          paddingWidth: 35,
          paddingHeight: 10,
          justified: true
      });

  $('.front').on('click', function(){
    $(this).parent().addClass('flip');
  });

$('.back').on('click', function() {
    $(this).parent().removeClass('flip');
  });

/**
 * Flip a random card to show the viewer that it's possible
 */

var randomFlip = function() {
  var previousIndex
    , totalCards = $('.card').length;

 this.flip = function(){
   if (previousIndex) {
    $('.card').get(previousIndex).classList.remove('flip')
  }

  var randomIndex = function(){
    var newIndex = Math.floor(Math.random() * totalCards); 
    if (newIndex === previousIndex) {
      randomIndex(); 
      return false;
    } else {
      previousIndex = newIndex; 
      return newIndex;
    }
  }

  var random = randomIndex();
  if (random)  $('.card').get(random).classList.add('flip')
 }

  return this; 
}();


setInterval(function(){
  randomFlip.flip()
}, 10000);

/**
 * Enter full screen mode
 */

$('#fullscreenmode').on('click', function(e){
  var $app = $('#app');
  if ($app.hasClass('fullscreen')) {
      $(e.currentTarget).text('(Full Screen)')
      $app.removeClass('fullscreen');
      $('#modalbackdrop').removeClass('open');
      $('#flipcard-wrapper').width($('#app').width());
      flipcard.redraw(); 
  } else {
      $(e.currentTarget).text('(Exit Full Screen)')
      $app.addClass('fullscreen');
      $('#modalbackdrop').addClass('open');
      $('#flipcard-wrapper').width($('#app').width() - 50);
      flipcard.redraw(); 
  }
})
});
