from conexao import conectar

conn = conectar()

cursor = conn.cursor()

cursor.execute("""
SELECT *
FROM movimentacoes
ORDER BY id DESC
LIMIT 5
""")

resultado = cursor.fetchall()

for linha in resultado:
    print(linha)

cursor.close()
conn.close()