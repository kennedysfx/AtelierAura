// Hero slides
import Vallure_l from '../../public/hero/Vallure-l.webp';
import Vallure_p from '../../public/hero/Vallure-p.webp';
import Blanc_l from '../../public/hero/Blanc-l.webp';
import Blanc_p from '../../public/hero/Blanc-p.webp';
import Noir_l from '../../public/hero/Noir-l.webp';
import Noir_p from '../../public/hero/Noir-p.webp';
import Rouge_l from '../../public/hero/Rouge-l.webp';
import Rouge_p from '../../public/hero/Rouge-p.webp';
import Dore_l from '../../public/hero/Dore-l.webp';
import Dore_p from '../../public/hero/Dore-p.webp';

// Bestseller / product images (reused across bestseller grid, celeb badges, collections)
import Rouge from '../../public/bestseller/rouge.webp';
import Noir from '../../public/bestseller/noir.webp';
import Elixir from '../../public/bestseller/elixir.webp';
import Argent from '../../public/bestseller/argent.webp';
import Santal from '../../public/bestseller/santal.webp';
import Dore from '../../public/bestseller/dore.webp';
import Blanc from '../../public/bestseller/blanc.webp';
import Cristal from '../../public/bestseller/cristal.webp';
import Ambre from '../../public/bestseller/ambre.webp';
import Absolu from '../../public/bestseller/absolu.webp';

// Celebrity portraits
import RanbirKapoor from '../../public/celebrities/ranbir-kapoor.avif';
import SobhitaDhulipala from '../../public/celebrities/sobhita-dhulipala.avif';
import RegeJeanPage from '../../public/celebrities/rege-jean-page.avif';
import AnyaTaylorJoy from '../../public/celebrities/anya-taylor-joy.avif';
import MaleModel from '../../public/celebrities/malemodel.png';
import Anokyai from '../../public/celebrities/anokyai.png';

// Cosmetic section
import CosmeticL from '../../public/cosmetic/cosmetic-l.avif';
import CosmeticP from '../../public/cosmetic/cosmetic-p.avif';
import AboutUs from '../../public/cosmetic/about-us.avif';

// Featured perfume overlay images
import Sauvage from '../../public/featurepic/Sauvage.webp';
import Armani from '../../public/featurepic/Armani.webp';
import YSL from '../../public/featurepic/YSL.webp';
import Old from '../../public/featurepic/Old.webp';
import Haltane from '../../public/featurepic/Haltane.webp';
import Cherry from '../../public/featurepic/Cherry.webp';
import Lattafa from '../../public/featurepic/Lattafa.webp';
import Imperial from '../../public/featurepic/Imperial.webp';
import Acqua from '../../public/featurepic/Acqua.webp';
import Bleu from '../../public/featurepic/Bleu.webp';

export const hero = {
  vallure: { l: Vallure_l, p: Vallure_p },
  blanc: { l: Blanc_l, p: Blanc_p },
  noir: { l: Noir_l, p: Noir_p },
  rouge: { l: Rouge_l, p: Rouge_p },
  dore: { l: Dore_l, p: Dore_p },
};

export const bestseller = {
  rouge: Rouge, noir: Noir, elixir: Elixir, argent: Argent, santal: Santal,
  dore: Dore, blanc: Blanc, cristal: Cristal, ambre: Ambre, absolu: Absolu,
};

export const celeb = {
  ranbir: RanbirKapoor, sobhita: SobhitaDhulipala, rege: RegeJeanPage, anya: AnyaTaylorJoy,
  malemodel: MaleModel, anokyai: Anokyai,
};

export const cosmetic = { l: CosmeticL, p: CosmeticP, aboutUs: AboutUs };

export const featurepic: Record<string, any> = {
  Sauvage, Armani, YSL, Old, Haltane, Cherry, Lattafa, Imperial, Acqua, Bleu,
};