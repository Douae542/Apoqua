from database import engine
from sqlalchemy import text

def forcer_type_text():
    # engine.begin() ouvre une transaction qui s'enregistre (commit) automatiquement à la fin
    with engine.begin() as conn:
        print("Envoi des commandes SQL à PostgreSQL...")
        
        # On force les colonnes problématiques à devenir des textes illimités (TEXT)
        conn.execute(text("ALTER TABLE fiches ALTER COLUMN vehicle_area TYPE TEXT;"))
        conn.execute(text("ALTER TABLE fiches ALTER COLUMN \"ref_screw_nut_Bdl\" TYPE TEXT;"))
        conn.execute(text("ALTER TABLE fiches ALTER COLUMN triplet_for_poro TYPE TEXT;"))
        conn.execute(text("ALTER TABLE fiches ALTER COLUMN designation_en TYPE TEXT;"))
        conn.execute(text("ALTER TABLE fiches ALTER COLUMN designation_fr TYPE TEXT;"))
        
        print("✅ Succès ! Les colonnes ont été modifiées directement dans le moteur de la base de données.")

if __name__ == "__main__":
    forcer_type_text()