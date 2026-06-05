import pandas as pd
from pathlib import Path

from conexao import conectar

conn = conectar()

df_sistema = pd.read_sql(
    """
    SELECT *
    FROM movimentacoes
    """,
    conn
)

print(df_sistema)

BASE_DIR = Path(__file__).resolve().parent

arquivo_csv = BASE_DIR / 'extratos' / 'extrato_banco.csv'

df_banco = pd.read_csv(arquivo_csv)

print(df_banco)

resultado = df_sistema.merge(
    df_banco,
    on='descricao',
    how='left',
    suffixes=('_sistema', '_banco')
)

print(resultado)

def definir_status(linha):

    if pd.isna(linha['valor_banco']):
        return 'NAO_ENCONTRADO'

    if float(linha['valor_sistema']) == float(linha['valor_banco']):
        return 'CONCILIADO'

    return 'DIVERGENTE'

resultado['novo_status'] = resultado.apply(
    definir_status,
    axis=1
)


print(
    resultado[
        [
            'descricao',
            'valor_sistema',
            'valor_banco',
            'novo_status'
        ]
    ]
)

cursor = conn.cursor()

for _, linha in resultado.iterrows():

    cursor.execute(
        """
        UPDATE movimentacoes
        SET status = %s
        WHERE id = %s
        """,
        (
            linha['novo_status'],
            int(linha['id'])
        )
    )

conn.commit()

cursor.close()