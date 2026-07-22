/**
 * footer — wheelercat mega footer (template-slotted, #95; fixed section
 * contract per anti-pattern 5).
 * Fetches the authored footer document (default /footer, overridden per page
 * via `footer` metadata — this site authors /wheelercat/footer) and slots its
 * FIVE sections:
 *   1. brand   — logo + dealer description
 *   2. links   — "Quick Links" column (h2 + ul)
 *   3. contact — "Contact Us" column (h2 + address + tel link)
 *   4. social  — "Connect With Us" column (h2 + ul of social links; the link
 *                TEXT names the network and becomes the icon + aria-label)
 *   5. legal   — copyright line + legal link list
 * Chrome copy is presentation — key facts also live in page content (#86).
 */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICONS = {
  phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M728 960H298Q267 960 245.0 938.0Q223 916 223 885Q223 885 223.0 885.0Q223 885 223 885V11Q223 -20 245.0 -42.0Q267 -64 298 -64H728Q759 -64 781.0 -42.0Q803 -20 803 11V885Q803 916 781.0 938.0Q759 960 728 960ZM747 130H279V834H747ZM613 884H413V906H613V884ZM698 894Q698 894 698.0 894.0Q698 894 698 894Q698 886 692.5 880.5Q687 875 679 875Q671 875 665.5 880.5Q660 886 660 894Q660 902 665.5 907.5Q671 913 679 913Q687 913 692.5 907.5Q698 902 698 894ZM604 16H422V71H604Z"/></svg>',
  facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M357 382H230Q214 382 208.5 388.0Q203 394 203 409V564Q203 579 209.0 585.0Q215 591 230 591H357V704Q356 706 356.0 708.0Q356 710 356 712Q356 750 365.5 784.5Q375 819 392 850L391 848Q410 881 439.0 905.5Q468 930 504 943H505Q527 951 551.0 955.5Q575 960 601 960Q602 960 602.5 960.0Q603 960 604 960H729Q743 960 749.0 954.0Q755 948 755 934V788Q755 775 749.0 769.0Q743 763 729 763Q704 763 678.0 762.5Q652 762 626 761Q600 761 586.5 748.5Q573 736 573 709Q572 680 572.5 651.5Q573 623 573 594H722Q737 594 743.5 587.5Q750 581 750 565V410Q750 395 744.0 389.0Q738 383 722 383H573V-35Q573 -51 567.0 -57.5Q561 -64 544 -64H383Q369 -64 363.0 -57.5Q357 -51 357 -37Z"/></svg>',
  instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M994 639Q993 672 987.0 703.0Q981 734 970 763V760Q951 811 913.0 848.5Q875 886 826 905L825 906Q798 916 767.5 922.5Q737 929 704 929Q664 931 632.0 931.5Q600 932 498 932Q397 932 365.0 931.5Q333 931 293 929Q260 929 229.0 922.5Q198 916 170 905L172 906Q146 896 124.0 881.5Q102 867 84 849Q65 830 50.5 808.5Q36 787 27 762L26 760Q16 734 10.0 703.0Q4 672 3 640Q1 600 0.5 568.0Q0 536 0 434Q0 333 0.5 301.0Q1 269 3 229Q4 196 10.0 165.0Q16 134 27 105L26 108Q46 58 83.5 20.0Q121 -18 170 -37L172 -38Q199 -48 229.5 -54.0Q260 -60 292 -61H293Q333 -63 365.0 -63.5Q397 -64 498 -64Q599 -64 631.5 -63.5Q664 -63 703 -61Q736 -60 767.0 -54.0Q798 -48 827 -37L824 -38Q875 -18 912.5 19.5Q950 57 969 106L970 108Q980 135 986.5 165.5Q993 196 993 228V229Q995 269 995.5 301.0Q996 333 996 434Q996 535 995.5 567.5Q995 600 994 639ZM904 233Q904 208 899.5 184.0Q895 160 886 138L887 140Q874 107 849.5 83.0Q825 59 793 46H792Q772 38 748.5 33.5Q725 29 700 28Q660 27 629.0 26.5Q598 26 498 26Q399 26 367.5 26.5Q336 27 297 28Q272 29 248.5 33.5Q225 38 203 46H205Q188 52 173.5 61.5Q159 71 148 83Q135 95 126.0 109.0Q117 123 111 139L110 140Q102 161 98.0 184.0Q94 207 93 232Q91 272 90.5 303.0Q90 334 90 434Q90 533 90.5 564.5Q91 596 93 635Q93 660 98.0 683.5Q103 707 111 729L110 727Q117 744 126.5 758.5Q136 773 148 785Q159 797 173.5 806.0Q188 815 204 821L205 822Q226 830 249.0 834.5Q272 839 297 839Q337 841 368.0 841.5Q399 842 499 842Q598 842 629.5 841.5Q661 841 700 839Q725 839 748.5 834.0Q772 829 794 821L792 822Q809 815 823.5 806.0Q838 797 850 785Q862 773 871.0 758.5Q880 744 886 728L887 727Q895 707 899.5 683.5Q904 660 904 635Q906 595 906.5 564.0Q907 533 907 434Q907 334 906.5 303.0Q906 272 904 233ZM498 690Q445 690 399 670Q352 650 317.5 615.0Q283 580 262 534Q242 487 242 434Q242 381 262 334Q283 288 317.5 253.0Q352 218 399 198Q445 178 498 178Q551 178 598 198Q645 218 679.5 253.0Q714 288 734 334Q754 381 754 434Q754 487 734 534Q714 580 679.5 615.0Q645 650 598 670Q551 690 498 690ZM498 268Q430 268 381.0 316.5Q332 365 332 434Q332 503 381.0 551.5Q430 600 498 600Q567 600 615.5 551.5Q664 503 664 434Q664 365 615.5 316.5Q567 268 498 268ZM824 700Q824 700 824.0 700.0Q824 700 824 700Q824 675 806.5 657.5Q789 640 764 640Q740 640 722.5 657.5Q705 675 705 700Q705 725 722.5 742.5Q740 760 764 760Q789 760 806.5 742.5Q824 725 824 700Z"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M1024 -64V311Q1024 380 1014 440Q1005 499 977.5 542.5Q950 586 900 611Q850 636 769 636Q692 636 640.5 601.0Q589 566 568 526H566V620H362V-64H575V275Q575 342 597.0 396.5Q619 451 701 451Q783 451 797.5 390.5Q812 330 812 270V-63H1024ZM17 620H229V-64H17ZM123 960Q123 960 122.5 960.0Q122 960 122 960Q71 960 35.0 924.0Q-1 888 -1 836Q-1 785 35.0 749.0Q71 713 122 713Q173 713 209.5 749.0Q246 785 246 836Q246 837 246.0 837.0Q246 837 246 837Q246 888 210.0 924.0Q174 960 123 960Z"/></svg>',
  youtube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M1003 725Q994 758 970.0 782.0Q946 806 914 815L913 816Q883 824 816 828Q750 833 682.5 835.0Q615 837 563 837Q512 837 512 837Q512 837 461 837Q409 837 341.5 835.0Q274 833 208 829Q141 824 111 816Q78 807 54.0 783.0Q30 759 21 726V725Q13 695 9 653Q5 611 3.0 572.0Q1 533 0 506Q0 479 0 479Q0 479 0 452Q1 424 3.0 385.5Q5 347 9 305Q13 262 21 233Q30 200 54.0 176.0Q78 152 110 143L111 142Q142 134 208 130Q275 125 342.5 123.0Q410 121 461 121Q512 121 512 121Q512 121 563 121Q615 121 682.5 123.0Q750 125 816 129Q883 134 913 142Q946 151 970.0 175.0Q994 199 1003 231V232Q1011 262 1015 304Q1019 346 1021.0 385.0Q1023 424 1024 451Q1024 478 1024 478Q1024 478 1024 506Q1024 533 1022.0 572.0Q1020 611 1015 653Q1011 695 1003 725ZM410 326V633L676 479Z"/></svg>',
  twitter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path transform="scale(1 -1) translate(0 -960)" d="M1024 769Q998 757 967.5 748.5Q937 740 905 736H903Q936 756 959.5 785.5Q983 815 995 851L996 852Q967 835 934.0 822.0Q901 809 865 802H862Q833 832 793.5 850.0Q754 868 709 868Q665 868 627 851Q589 835 560.5 806.5Q532 778 515 740Q499 701 499 658Q499 645 500.5 632.5Q502 620 505 608L504 610Q439 613 377 630Q316 647 261.0 675.0Q206 703 159 742Q111 781 72 828L71 829Q58 807 50.5 780.0Q43 753 43 724Q43 669 68.5 623.5Q94 578 136 549Q110 550 85.5 557.0Q61 564 40 576L41 575V573Q41 497 89.0 439.5Q137 382 208 367L210 366Q197 363 183.0 361.0Q169 359 155 359Q154 359 154.0 359.0Q154 359 154 359Q154 359 154.0 359.0Q154 359 154 359Q144 359 133.5 360.0Q123 361 113 363H115Q135 300 188.5 259.0Q242 218 311 217Q258 175 191.5 151.0Q125 127 51 127Q51 127 50.5 127.0Q50 127 50 127Q50 127 50.0 127.0Q50 127 49 127Q36 127 23.5 128.0Q11 129 -2 130H0Q34 108 72 90Q109 73 149.5 61.0Q190 49 233 42Q276 36 321 36Q321 36 321.5 36.0Q322 36 322 36Q467 36 578 90Q690 144 766.0 230.0Q842 316 881 423Q920 529 920 633Q920 640 919.5 647.0Q919 654 919 661Q950 683 976.0 710.0Q1002 737 1023 768L1024 769Z"/></svg>',
};

export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  block.textContent = '';
  const sections = [...fragment.children].map((s) => s.querySelector(':scope > div') || s);
  const [brand, links, contact, social, legal] = sections;

  const grid = document.createElement('div');
  grid.className = 'footer-grid';

  if (brand) {
    brand.className = 'footer-brand';
    grid.append(brand);
  }
  if (links) {
    links.className = 'footer-col';
    grid.append(links);
  }
  if (contact) {
    contact.className = 'footer-col footer-contact';
    const tel = contact.querySelector('a[href^="tel:"]');
    if (tel) {
      tel.className = 'footer-phone';
      const icon = document.createElement('span');
      icon.className = 'footer-phone-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = ICONS.phone;
      tel.prepend(icon);
    }
    grid.append(contact);
  }
  if (social) {
    social.className = 'footer-col footer-social-col';
    const list = social.querySelector('ul');
    if (list) {
      const row = document.createElement('div');
      row.className = 'footer-social';
      list.querySelectorAll('a').forEach((a) => {
        const name = a.textContent.trim();
        const key = name.toLowerCase();
        a.setAttribute('aria-label', name);
        if (ICONS[key]) {
          a.textContent = '';
          const icon = document.createElement('span');
          icon.className = 'footer-social-icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = ICONS[key];
          a.append(icon);
        }
        row.append(a);
      });
      list.replaceWith(row);
    }
    grid.append(social);
  }

  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  footer.append(grid);

  if (legal) {
    legal.className = 'footer-legal';
    footer.append(legal);
  }

  block.append(footer);
}
