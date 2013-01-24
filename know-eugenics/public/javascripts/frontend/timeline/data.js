var categories = [institutions, people, organizations, politics, science]

var json = [
{
  name: 'Gregor Mendel Publishes His Paper on Heredity',
  startDate: '1866-2-20',
  description: 'February 20, 1866. Gregor Mendel, an Augustinian monk, publishes his paper, “Versuche über Pflanzenhybriden” (“Experiments on Plant Hybridization”), containing his findings on heredity in the journal Proceedings of the Natural History Society of Brunn. These findings, which demonstrate that inheritance follows particular laws, emerged from years of observations breeding pea plants at the experimental garden of the Augustinian Abbey of St. Thomas in Brno. Mendel’s work show that certain traits are dominant or recessive and how the combination thereof produces observable variations to characteristics such as flower colour or the texture of a seed. His work went largely unremarked for 35 years following publication, until it was independently duplicated by Hugo de Vries and Carl Correns in the 1890s. Mendel’s laws are often reduced to the general statement “like begets like,” which became a frequent justification for eugenic practices.',
  type: 'text',
  category: ['science']
}, {
  name: 'Francis Galton Publishes "Hereditary Genius"',
  startDate: '1869',
  description: '1869. Francis Galton publishes his influential book Hereditary Genius. Within it, he attempts to understand the heritability of human intelligence from a social sciences perspective. This volume proved a cornerstone of the nascent eugenics movement. A second edition, with a new preface by Galton, was released in 1892.',
  type: 'text',
  category: ['science']
}, {
  name: "Charles Darwin Publishes 'The Descent of Man'",
  startDate: '1871',
  description: '1871. Charles Darwin expands on evolutionary theory in his book The Descent of Man, and Selection in Relation to Sex to directly follow the concepts introduced in On the Origin of Species. In this volume, he applies his theories to human evolution and discusses concepts related to human “races,” sexual differentiation and the relation of his evolutionary theory to human society. Most significantly, he discusses medical advances that allow “the weak” to reproduce, and cautions that reason (ie. disallowing their reproduction) should not replace sympathy. This book has entered the public domain and is available as an e-book here. More information about Darwin and his works, including full copies his publications, is available at The Complete Work of Charles Darwin Online.',
  type: 'text',
  category: ['science']
}, {
  name: 'Samuel Butler Publishes His Novel Erewhon, or, Over the Range',
  startDate: '1872',
  description: '1872. Samuel Butler anonymously publishes Erewhon, or, Over the Range, a bitingly satiric novel criticizing social Darwinism and eugenic utopias.',
  type: 'text',
  category: ['art']
}, {
  name: 'Francis Galton Coins the Term "Eugenics"',
  startDate: '1883-5-16',
  description: 'May 16, 1883. Francis Galton coins the term “eugenics.” He details the concept in his book Inquiries into Human Faculty and its Development, and recommends that individuals from families that rank highly in his merit system be encouraged to marry early and given incentives to have children. He also condemned late marriages within this same group as “dysgenic,” or disadvantageous to the human species.',
  type: 'text',
  category: ['science']
},
  {
  name: 'Alberta Hospital Ponoka Opens.',
  startDate: '1911',
  description: 'Alberta Hospital Ponoka opens. This institutions will ultimately be responsible for approximately 60% of cases considered by the Alberta Eugenics board.',
  type: 'text',
  category: ['institutions']
}, {
  name: "Helen MacMurchy is Appointed Ontario's 'Inspector of the Feeble-minded.",
  startDate: '1915',
  description: 'Helen MacMurchy is appointed as Ontario's "Inspector of the Feeble-minded." In this role,
  MacMurchy guides the National Council of Women to endorse sterilization as a means of preventing mothers from filling the cradles with degenerate babies.',
  type: 'text',
  category: ['people']
}, {
  name: 'The Canadian National Committee for Mental Hygienne (CNCMH) is Established',
  startDate: '1918',
  description: 'The Canadian National Committee for Mental Hygiene (CNCMH) is founded by Dr. Clarence M. Hincks and Clifford W. Beers. Its objectives included providing adequate care for the "mentally deficient" and preventing mental disease and "deficiency." This organization later becomes the present-day Canadian Mental Health Association.',
  type: 'text',
  category: ['organizations', 'science']
}, {
  name: 'The United Farm Women of Alberta Campaigns for Eugenic Sterilization',
  startDate: '1924',
  description: 'The United Farm Women of Alberta, under President Ms. Margaret Gunn, launches a campaign for public support for the sterilization of "mental defectives."',
  type: 'text',
  category: ['organizations', 'politics']
}, {
  name: 'The Sexual Sterilization Act is Enacted in the Province of Alberta',
  startDate: '1928',
  endDate: '1972',
  description: 'The Sexual Sterilization Act of Alberta is enacted by the Legislative Assembly of Alberta. This bill was first introduced on March 5, 1927, but was pulled from the schedule. On February 23, 1928, the Hon. George Hoadley, Minister of Health, reintroduced it to the Legilsative Assembly. It passed into law despite the efforts of the People's League to Act to contest its constitutionality. This law formed the Alberta Eugenics Board, headed by Dr. John MacEachran, to oversee the sterilizations.',
  type: 'text',
  category: ['politics', 'legislation']
}, {
  name: 'Dr. John MacEachran is Appointed Head of the Alberta Eugenics Board',
  startDate: '1928',
  description: 'Dr. John MacEachran, head of the University of Alberta's Department of Psychology and Philosophy, is appointed chairman of the Alberta Eugenics Board (AEB). The AEB was formed under the sexual Sterilization Act of Alberta, which passed into Alberta law this day. Its purpose was to administer the provices' sexual sterilization program and determine whether sterilization was appropriate on a case-by-case basis.',
  type: 'text',
  category: ['people', 'organizations']
}, {
  name: 'The First Ammednment to the Sexual Sterilization Act of Alberta is Passed',
  startDate: '1937',
  description: 'The first Amendment to the Sexual Sterilization Act of Alberta passes in the Alberta Legislature. This amendment was proposed by Dr. W.W. Cross, Social Credit Minister of Health, to address criticism that the Act was too restrictive in its original form. To amend these concerns, a distinction was made between psychotic persons and mentally defective persons. The criterion for sterilization was extended to include the risk of mental injury to the patient or progeny, in addition to cases determined to derive from genetic defect, as grounds for sterilization. Furthermore, consent of the person to be sterilized, or of their spouse, parent, guardian, or the Minister, was only to be required the case of psychotic persons. The exception from civil action was also extended to include both persons taking part in surgical operations and persons in charge of mental institutions referring patients to the Alberta Eugenics Board.',
  type: 'text',
  category: ['legislation', 'politics']
}, {
  name: 'The Second Ammendment to the Sexual Sterilization Act of Alberta is Passed in the Alberta Legislation',
  startDate: '1942',
  description: 'The second amendment to the Sexual Sterilization Act of Alberta is passed in the Alberta Legislature to broaden the category of mental patients who could be recommended for sterilization. The criteria now included persons with neurosyphillis, epilepsy accompanied by psychosis, mental deterioration and Huntington’s disease. The consent of the patient was required for these persons, with the exception of patients with Huntington’s chorea who were also psychotic.',
  type: 'text',
  category: ['legislation', 'politics']
}, {
  name: 'Dr. John MacEachran Steps Down as Head of the Alberta Eugenics Board',
  startDate: '1968',
  description: 'Dr. John MacEachran steps down from his role as Head of the Alberta Eugenics Board, a position he held continuously from 1928. He is succeeded by R. K. Thomson, who saw the Alberta Eugenics Board through to the repeal of the Sexual Sterilization Act in 1972.',
  type: 'text',
  category: ['people', 'organizations']
}, {
  name: 'The Sexual Sterilization Act of Alberta is Repealed',
  startDate: '1972',
  description: 'The newly elected Progressive Conservative government of Alberta, headed by Premier Peter Lougheed, repeals the Sexual Sterilization Act of Alberta. The bill for the repeal was introduced by David King, MLA Edmonton Highlands. The Act was attacked on legal and moral grounds.',
  type: 'text',
  category: ['legislation', 'politics']
}, {
  name: 'Several Hundred Legal Actions are Initiated Against the Province of Alberta',
  startDate: '1995',
  description: 'Several hundred legal actions are initiated against the Province of Alberta by individuals who had been institutionalized and sterilized under the Sexual Sterilization Act of Alberta. The law firms of Field, Perraton, and Perraton (Jon Faulds and Sandra Anderson) and Parley-McLaws (Allan Garber) provide legal representation in these cases.',
  type: 'text',
  category: ['law']
}, {
  name: "Leilani Muir Sues Her Majesty the Queen in Right of Alberta",
  startDate: '1995',
  description: 'June 12, 1995. Leilani Muir sues Her Majesty the Queen in Right of Alberta for stigmatization as a moron, wrongful confinement and wrongful sterilization. Ms. Muir is represented by Jon Faulds and Sandra Anderson of the firm Field, Perraton, and Perraton, now Field Law.  The Hon. Madame Justice J.B. Veit, presiding over the Court of Queen’s Bench in Edmonton, rules in favour of the plaintiff and awards Muir $740,780 CAD and an additional sum of $230,000 CAD for legal costs.',
  type: 'text',
  category: ['law', 'people']
}, {
  name: 'The Alberta Consortium on the History of Eugenics is Formed',
  startDate: '2005',
  description: 'September 1, 2005. The Alberta Consortium on the History of Eugenics (ACHE) is formed.',
  type: 'text',
  category: ['organizations']
}, {
  name: 'Dr. Rob Wilson Launches the Living Archives on Eugenics in Western Canada Project',
  startDate: '2010',
  description: 'September 1, 2010. Dr. Rob Wilson, of the University of Alberta’s Department of Philosophy, is awarded a CURA SSRHC grant. This grant permits the formation of the Living Archives on Eugenics in Western Canada Project.',
  type: 'text',
  category: ['organizations', 'university']
}, {
  name: '"Remebering the History of Eugenics in Alberta Day" Proclaimed in Edmonton',
  startDate: '2010',
  description: 'October 14, 2010. The Living Archives for Eugenics in Western Canada project receives an official proclamation from the City of Edmonton declaring October 23, 2010 to be “Remembering the History of Eugenics in Alberta Day” in Edmonton.',
  type: 'text',
  category: ['organizations']
}]