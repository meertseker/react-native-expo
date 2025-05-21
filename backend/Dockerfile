# Python 3.11 slim image'dan başla
FROM python:3.11-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Gereksinimleri kopyala ve yükle
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Tüm dosyaları kopyala
COPY . .
EXPOSE 5000
# Uygulamayı başlat (app.py yerine kendi giriş dosyanı yaz)
CMD ["python", "app.py"]
