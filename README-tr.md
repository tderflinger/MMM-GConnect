# Magic Mirror² MMM-GConnect

[[Español]](./README-es.md) [[English]](./README.md)

Bu, Garmin Connect™ hesabınızda
kaydedilen en son etkinlikten verileri görüntüleyen bir [``Magic Mirror²``](https://magicmirror.builders/) modülüdür.

Özellikle aşağıdaki verileri görüntüler:
- son spor faaliyetinizden bu yana geçen günler
- son spor faaliyetinin toplam mesafesi
- son spor faaliyetinin toplam süresi
- son spor aktivitesinin ortalama kalp atış hızı

İsteğe bağlı olarak, son etkinliğin rotasını gösteren bir vektör haritasını da etkinleştirebilirsiniz. haritası [MapLibre](https://maplibre.org) web harita kütüphanesini ve [MapTiler](https://www.maptiler.com) harita hizmetini kullanır. Bir harita göstermek için
MapTiler'a kaydolmalı ve bir API anahtarı edinmelisiniz. API anahtarı aylık sabit bir kullanım miktarı için ücretsizdir.

Bu modülü kullanabilmek için bir [`Garmin Connect™`](https://connect.garmin.com/) hesabınızın olması gerekir. kullanıcı adınızı ve şifrenizi `config.js` dosyasında aşağıda belirtildiği gibi yapılandırabilirsiniz.

Not: Bu proje Garmin şirketi ile bağlantılı değildir.

## Önizleme Ekran Görüntüsü

Bu, Magic Mirror² GConnect'in benim yapılandırmamda nasıl göründüğünün bir örneğidir:

![Magic Mirror² GConnect exmaple screen](./doc/screenshot-MMM-GConnect-Up.png)

## Kurulum

Bu depoyu MagicMirror `modules` klasörünüze klonlayın.

Örnek:

```bash
cd /home/pi/MagicMirror/modules
git clone https://github.com/tderflinger/MMM-GConnect.git
```

JavaScript bağımlılıklarını yükleyin:

```bash
cd /home/pi/MagicMirror/modules/MMM-GConnect
npm i
```

Ayrıca `bin` klasörü altındaki `MMM-GConnect` dizininde bulunan tcx-ls veya tcx-ls-arm ikili dosyasının çalıştırma hakkını da ayarlamanız gerekecektir.

```bash
cd /home/pi/MagicMirror/modules/MMM-GConnect/bin
chmod +x ./tcx-ls-arm
```

Bu ikili yalnızca bir harita gösterilirken gereklidir. Garmin Connect'ten indirilen TCX dosyasını daha sonra haritada görüntülenecek olan bir GeoJSON dosyasına dönüştürmek için kullanılır.

Son olarak, yapılandırma dosyanızı `config/config.js` altında aşağıdaki yapılandırma ile düzenleyin.
```
{	
  module: "MMM-GConnect",
  position: "top_left",
  config: {
    interval: 60000000,
    loginName: "Your login name",
    password: "Your login password",
    showMap: true,
    mapTilerKey: "Your API key",
  },
},
```

MapTiler API anahtarını [MapTiler web sitesine](https://www.maptiler.com) kayıt olarak ve sol menüdeki "API Anahtarları "na giderek alabilirsiniz. Aylık belirli bir miktarda çağırma için ücretsizdir.

Harita özelliğini kullanmanız ve çok fazla etkinliğe sahip olmanız durumunda, MMM-GConnect içindeki `data` klasörünün indirilen TCX ve GeoJSON etkinlik dosyalarıyla dolabileceğini unutmayın. Bu klasörü zaman zaman temizlemeyi düşünün.

## Yapılandırma Seçenekleri
| **Opsiyon**        | **Açıklama** |
| --- | --- |
| `interval`      | Garmin Connect™'ten yeni veri alımı arasındaki aralık ms cinsinden |
| `loginName`      | Garmin Connect™'e giriş adınız |
| `password`      | Garmin Connect™ şifreniz |
| `showMap`      | Boolean, rotanın haritasını göstermek için true olarak ayarlanır |
| `mapTilerKey`      | MapTiler harita hizmetinin API anahtarı. Yalnızca bir harita göstermek istediğinizde gereklidir. |

## TCX Dosyaları Aranıyor

Uygulamayı kapsamlı bir şekilde test etmek ve daha sağlam hale getirmek için TCX dosya bağışları arıyorum.
Lütfen tüm özel verileri kaldırın. TCX dosyası yalnızca uygulamanın işlevselliğini test etmek için kullanılır.

İlgileniyor musunuz? Lütfen benimle iletişime geçin.

## Test

Magic Mirror² GConnect` modülünü Raspberry OS
ve Node 22 ve `Magic Mirror²` sürüm 2.31.0 ile bir Raspberry Pi 3B üzerinde test ettim.

## Simgeler

Modül iconduck.com'dan aşağıdaki simgeleri kullanır:

- https://iconduck.com/icons/12253/running International Attribution License
- https://iconduck.com/icons/117847/heart-love-like MIT License
- https://iconduck.com/icons/88028/clock-time-four-outline Apache License

## Referanslar

Magic Mirror²: https://magicmirror.builders

JavaScript library garmin-connect: https://github.com/Pythe1337N/garmin-connect

Preact: https://preactjs.com

HTM: https://github.com/developit/htm

Garmin Connect™: https://connect.garmin.com/

MapLibre: https://maplibre.org

MapTiler: https://www.maptiler.com

Tcx-ls: https://github.com/tderflinger/tcx-ls

Pythe1337N'nin `garmin-connect` JavaScript kütüphanesini oluşturmadaki harika çalışmasına teşekkürler.
Onun çalışmaları olmasaydı, bu modül mümkün olmazdı.

## Lisans

MIT Lisansı