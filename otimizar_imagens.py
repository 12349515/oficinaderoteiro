#!/usr/bin/env python3
"""
Script de Otimização Automática de Imagens
Oficina de Roteiro - marmifit.com.br

Uso:
    python3 otimizar_imagens.py /caminho/para/pasta/imagens

Requisitos:
    pip3 install Pillow
"""

import os
import sys
from pathlib import Path
from PIL import Image

def otimizar_imagem(caminho_entrada, qualidade=85, max_width=1200):
    """
    Otimiza uma imagem reduzindo tamanho e convertendo para WebP
    
    Args:
        caminho_entrada: Caminho do arquivo de imagem
        qualidade: Qualidade da compressão (1-100)
        max_width: Largura máxima em pixels
    """
    try:
        # Abrir imagem
        img = Image.open(caminho_entrada)
        
        # Converter RGBA para RGB se necessário
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Redimensionar se necessário
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Salvar versão otimizada PNG
        caminho_png = str(caminho_entrada)
        img.save(caminho_png, 'PNG', optimize=True, quality=qualidade)
        
        # Salvar versão WebP
        caminho_webp = os.path.splitext(caminho_entrada)[0] + '.webp'
        img.save(caminho_webp, 'WEBP', quality=qualidade, method=6)
        
        # Calcular economia
        tamanho_original = os.path.getsize(caminho_entrada)
        tamanho_png = os.path.getsize(caminho_png)
        tamanho_webp = os.path.getsize(caminho_webp)
        
        economia_png = ((tamanho_original - tamanho_png) / tamanho_original) * 100
        economia_webp = ((tamanho_original - tamanho_webp) / tamanho_original) * 100
        
        print(f"✅ {os.path.basename(caminho_entrada)}")
        print(f"   Original: {tamanho_original/1024:.1f} KB")
        print(f"   PNG:      {tamanho_png/1024:.1f} KB ({economia_png:.1f}% menor)")
        print(f"   WebP:     {tamanho_webp/1024:.1f} KB ({economia_webp:.1f}% menor)")
        print()
        
        return True
        
    except Exception as e:
        print(f"❌ Erro em {os.path.basename(caminho_entrada)}: {e}")
        return False

def processar_pasta(caminho_pasta):
    """Processa todas as imagens em uma pasta"""
    extensoes = ('.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG')
    
    pasta = Path(caminho_pasta)
    if not pasta.exists():
        print(f"❌ Pasta não encontrada: {caminho_pasta}")
        return
    
    imagens = [f for f in pasta.iterdir() if f.suffix in extensoes]
    
    if not imagens:
        print(f"❌ Nenhuma imagem encontrada em: {caminho_pasta}")
        return
    
    print(f"🖼️  Encontradas {len(imagens)} imagens para otimizar\n")
    print("=" * 60)
    
    sucesso = 0
    falhas = 0
    economia_total = 0
    
    for img in imagens:
        # Backup da original
        backup = img.with_suffix(img.suffix + '.backup')
        if not backup.exists():
            img.rename(backup)
            img = backup
        
        if otimizar_imagem(img):
            sucesso += 1
            # Calcular economia
            original = os.path.getsize(img)
            otimizado = os.path.getsize(str(img).replace('.backup', ''))
            economia_total += (original - otimizado)
        else:
            falhas += 1
    
    print("=" * 60)
    print(f"\n📊 RESUMO:")
    print(f"   Sucesso: {sucesso}")
    print(f"   Falhas:  {falhas}")
    print(f"   Economia total: {economia_total/1024:.1f} KB ({economia_total/1024/1024:.2f} MB)")
    print(f"\n💡 Backups salvos com extensão .backup")

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 otimizar_imagens.py /caminho/para/pasta/imagens")
        sys.exit(1)
    
    caminho = sys.argv[1]
    
    print("🚀 Otimizador de Imagens - Oficina de Roteiro")
    print("=" * 60)
    print(f"📁 Pasta: {caminho}\n")
    
    processar_pasta(caminho)
    
    print("\n✅ Processo concluído!")
    print("⚠️  Lembre-se de testar as imagens antes de deletar os backups")

if __name__ == '__main__':
    main()
