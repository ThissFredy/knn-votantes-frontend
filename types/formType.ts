export interface FormType {
    ord_has_children: number;
    ord_home_owner: number;
    ord_public_sector: number;
    ord_union_member: number;
    nom__primary_choice_CAND_Azon: number;
    nom__primary_choice_CAND_Boreal: number;
    nom__primary_choice_CAND_Civico: number;
    nom__primary_choice_CAND_Demetra: number;
    nom__primary_choice_CAND_Electra: number;
    nom__primary_choice_CAND_Frontera: number;
    nom__primary_choice_CAND_Gaia: number;
    nom__primary_choice_CAND_Halley: number;
    nom__primary_choice_CAND_Icaro: number;
    nom__primary_choice_CAND_Jade: number;
}

export interface UserInput {
    has_children: number;
    home_owner: number;
    public_sector: number;
    union_member: number;
    primary_choice: string; // "CAND_Azon", "CAND_Boreal", etc.
}
