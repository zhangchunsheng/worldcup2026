```shell
claude
制作2026世界杯网站，数据来源https://worldcup2026cn.com
更新readme.md
开发一个2026世界杯网站，列出所有比赛和时间表，可以点击按钮预测比分，显示比赛详情，比赛结果，更新实时比分，使用AI辅助预测比分，支持多语言，中文默认，英文翻译文件支持，使用Vite + Vue架构，可以通过json文件更新数据，使用Tailwind CSS样式
页面没有任何ajax请求到json文件
小组赛数据不全请补全数据
每场比赛使用卡片展示，增加比赛时间，使用北京时间，比赛地点，增加预测比分按钮，点击卡片可以查看比赛详情，包括预测比分，比赛结果，实时比分，比赛时间，比赛地点，.env增加claude_base_url变量，可以在页面上输入claude_base_url，claude_api_key，CLAUDE_MODEL
开幕战墨西哥vs南非已经结束，比分2：0，第二场比赛为韩国vs捷克也已经结束，比分为2：1，比赛信息为错误信息，请自行从网络获取并更新信息，比赛卡片按日期分块展示，已经结束的比赛可以通过json文件更新比分，已经结束的比赛不需要预测比分，预测比分使用claude预测并保存到本地缓存，在页面上展示预测比分，删除提交预测
/init
将claude.md改为中文
点击预测按钮没有反应
弹窗的预测按钮没有反应
MatchDetail.vue预测按钮没有反应
Extraneous non-emits event listeners (predictAi) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option
AISwitchToggle组件样式错误
AI预测没有请求大模型
将AI预测接口改为请求https://about.luomor.com/ai/claude，post请求，传入timestamp, sign, messages参数，其中sign为md5(key + timestamp)，其中key为常量，messages同anthropic api参数
md5结果同php计算不一致
已经结束比赛，同时显示真实比分和预测比分，如果比分一样，显示预测一致，否则显示预测错误
更新已经结束比赛比分
优化index.html页面seo

{"max_tokens": 4096, "temperature": 0.7}
{"max_tokens": 1280000, "temperature": 0.7}
schedule.json中小组赛有些存在日期错误，请修改
赛程每个card增加小组信息，例如A组，B组，C组等，在赛程后增加小组积分板块，显示每个小组的积分和排名，顶部增加链接跳转查看小组积分详情
小组积分未包含今日数据
小组分组数据没有了
小组信息有误，需要从网络获取并更新
增加进去32强的队伍版块
将倒计时改为已开赛多少天，决赛当天显示具体比赛时间，决赛后显示时钟可以查看时间
32强没有佛得角，计算有问题
32强显示小组积分和净胜球
乌拉圭应该是积2分，怎么显示积4分
夺冠热门有韩国，不合理，还不如日本呢
增加32强赛程
缺少6月30日比赛
6月30日01:00是巴西对日本，请更正
1/16决赛预测功能不可用，卡片点击没有效果
使用对阵图的形式展示32强赛程，确认晋级的队伍自动更新到下一轮
更新claude.md
/clear
KnockoutBracket.vue中对阵图缺少连线，采取左右对称的方式展示
两侧是1/16决赛，依次向内是1/8决赛，1/4决赛，尽量在一个页面显示
目前页面对阵图从左到右是1/4决赛，1/8决赛，1/16决赛，显示错误，请按1/16决赛，1/8决赛，1/4决赛显示
最左侧缺少1/16决赛
左侧滚动条无法滚动到最左侧，导致看不到左侧1/16决赛
增加32强赛程
对阵图改为上下结构
对阵图改为上下对称展示，顶部和底部是1/16决赛，依次向内是1/8决赛，1/4决赛

[1/16 左半区] — [1/8] — [1/4] — [半决赛] — [🏆 决赛][季军赛] — [半决赛] — [1/4] — [1/8] — [1/16 右半区]
```